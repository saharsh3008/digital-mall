# Digital Mall OS - Role-Based Access Control (RBAC) Design

*This document defines the security model, permission boundaries, and API access policies for the Digital Mall OS platform.*

## 1. Overview of Roles

| Role | Internal ID | Description | Auth Level |
| :--- | :--- | :--- | :--- |
| **Customer** | `guest` / `shopper` | End-users visiting the mall. Can be anonymous (Guest) or authenticated (Shopper). | Low / Medium |
| **Store Owner** | `tenant_manager` | Retailers managing a specific store presence. Scoped strictly to their assigned Store ID(s). | High |
| **Mall Admin** | `infrastructure_admin` | Mall operations team. Full control over the digital infrastructure and tenant management. | Critical |

---

## 2. Detailed Permission Matrix

### **A. Customer (Shopper)**
*The "Guest" experience must be viable without login (frictionless), but Login unlocks personalization.*

**Permissions:**
*   **READ (Public):** Directory, Map, Events, Operating Hours, Amenities.
*   **READ (Private - Auth required):** User Profile, Saved Offers, Parking Reservation History.
*   **WRITE (Auth required):** Update Profile, Save/Like Items, Submit Feedback/Support Ticket.

**API Access Table:**
| Endpoint | Method | Scope | Notes |
| :--- | :--- | :--- | :--- |
| `/api/public/directory` | GET | `public` | List all stores. |
| `/api/public/map` | GET | `public` | Fetch GeoJSON map data. |
| `/api/user/me` | GET | `user:self` | Get own profile details. |
| `/api/user/wallet/offers` | POST | `user:write` | Save a coupon to wallet. |
| `/api/parking/reserve` | POST | `user:write` | Book a parking spot. |

---

### **B. Store Owner (Tenant Manager)**
*Scoped strictly to the `store_id` linked to the user's account. Attempting to access other stores forces a `403 Forbidden`.*

**Permissions:**
*   **READ:** Own Store Profile, Store-Specific Analytics, Mall Global Events.
*   **WRITE:** Update Store Details (Desc, Tags), Manage Hours, Create/Edit/Delete Offers, Upload Assets (Images).
*   **DENIED:** Modifying Floor Plan location, Modifying other tenants, Viewing Mall-wide financial data.

**API Access Table:**
| Endpoint | Method | Scope | Notes |
| :--- | :--- | :--- | :--- |
| `/api/tenant/stores/:storeId` | PUT | `store:write` | Update description/logo. |
| `/api/tenant/stores/:storeId/offers` | POST | `store:offers:write` | Publish a new "Flash Sale". |
| `/api/tenant/stores/:storeId/analytics` | GET | `store:analytics` | View clicks/impressions for *this* store. |
| `/api/tenant/support` | POST | `support:write` | Direct channel to Mall Admin. |

---

### **C. Mall Admin (Infrastructure Operator)**
*God-mode access to the specific Mall instance.*

**Permissions:**
*   **READ:** All data across all tenants and users.
*   **WRITE:**
    *   **Tenant Mgmt:** Onboard/Offboard tenants, Reset tenant passwords.
    *   **Map Mgmt:** Update floor plans, move store marker locations (PostGIS updates).
    *   **System:** Configure global settings (Opening hours, Emergency Mode).
    *   **Broadcast:** Send push notifications to all users or all tenants.

**API Access Table:**
| Endpoint | Method | Scope | Notes |
| :--- | :--- | :--- | :--- |
| `/api/admin/tenants` | POST | `admin:tenants` | Create new tenant account. |
| `/api/admin/map/nodes` | PATCH | `admin:map` | Move a polygon/POI on the map. |
| `/api/admin/broadcast` | POST | `admin:notify` | Trigger emergency or promo alerts. |
| `/api/admin/analytics/global` | GET | `admin:analytics` | Full mall heatmap & revenue data. |

---

## 3. Implementation Policy (Middleware Logic)

### **Middleware: `verifyRole`**
All protected routes must pass through a middleware that checks the JWT claims.

**Pseudo-Code Example:**
```typescript
function protect(requiredRole, requiredScope) {
  return (req, res, next) => {
    const user = req.user; // Decoded from JWT

    // 1. Check Role Hierarchy
    if (user.role < requiredRole) return res.status(403).send("Insufficient Role");

    // 2. Check Context (Tenant Isolation)
    if (user.role === 'tenant_manager') {
       const targetStoreId = req.params.storeId;
       if (user.storeId !== targetStoreId) {
         return res.status(403).send("Unauthorized: You do not own this store.");
       }
    }

    next();
  };
}
```

### **Security Considerations**
1.  **Least Privilege:** Store Owners default to Read-Only until "Editor" permission is explicitly granted by the primary Store Manager.
2.  **Audit Logs:** Critical Admin actions (e.g., Delete Tenant, Move Map Node) must be logged to an immutable audit table (`admin_audit_log`).
3.  **API Rate Limiting:** Stricter limits on `public` endpoints; looser limits for authenticated `tenant` endpoints.
