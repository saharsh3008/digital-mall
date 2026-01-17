# Digital Mall OS - System Architecture

*This architecture is designed for high scalability, supporting multi-mall tenancy, high-concurrency footfall events (e.g., Black Friday), and real-time geospatial processing.*

## 1. High-Level Architecture Diagram
```mermaid
graph TD
    subgraph Clients
        Shopper[Shopper PWA (Mobile)]
        Tenant[Tenant Dashboard (Desktop/Tablet)]
        Admin[Mall Admin Console (Desktop)]
    end

    subgraph Edge_Layer
        CDN[CDN (Cloudflare/Vercel Edge)]
        ALB[Load Balancer / API Gateway]
    end

    subgraph Application_Layer
        CoreAPI[Core API Service (Node.js)]
        RealTime[Real-Time Engine (Socket.io)]
        CMS[Headless CMS (Strapi/Sanity)]
    end

    subgraph Data_Layer
        PrimaryDB[(PostgreSQL + PostGIS)]
        Cache[(Redis)]
        Search[(Elasticsearch/Algolia)]
    end

    subgraph Intelligence_Layer
        Analytics[Analytics Pipeline (ClickHouse)]
        AI_Recs[AI Recommendation Engine (Python/FastAPI)]
    end

    Shopper --> CDN
    Tenant --> CDN
    Admin --> CDN
    CDN --> ALB
    ALB --> CoreAPI
    ALB --> RealTime
    CoreAPI --> PrimaryDB
    CoreAPI --> Cache
    CoreAPI --> Search
    CoreAPI --> AI_Recs
    RealTime --> Cache
```

## 2. Component Breakdown

### **A. Frontend (The Experience Layer)**
*   **Tech Stack:** Next.js (React), Tailwind CSS, Framer Motion.
*   **Architecture:** Monorepo containing 3 distinct apps reusing a shared UI Library (Design System).
    1.  **Shopper PWA:** Mobile-first, offline-capable (Service Workers), heavily optimized for "First Contentful Paint" to load instantly on QR scan.
    2.  **Tenant Portal:** Dashboard-heavy, visualizing data and managing inventory.
    3.  **Admin Console:** Power-user tool for map management and user administration.

### **B. Backend (The Logic Layer)**
*   **Tech Stack:** Node.js (NestJS or Express), TypeScript.
*   **API Strategy:** Hybrid REST/GraphQL.
    *   **GraphQL:** For complex data fetching (e.g., "Get Mall X, Floor 2, all stores with 'Coffee', and their current offers").
    *   **REST:** For standard CRUD and webhooks (Payment integration, IoT sensor ingestion).
*   **Real-Time Engine:** A dedicated WebSocket service (Socket.io) to handle ephemeral state:
    *   Dynamic Parking Counter.
    *   "Flash Sale" push notifications.
    *   Live Indoor position updates.

### **C. Database & Storage (The Memory)**
*   **Primary Database:** **PostgreSQL**.
    *   **Why:** Robust relational integrity for Tenants, Leases, and Users.
    *   **Extension:** **PostGIS** for spatial queries (e.g., "Find all offers within 50 meters of coordinate X,Y").
*   **Caching:** **Redis**.
    *   Stores active sessions, real-time parking counts, and frequently accessed store directions.
*   **Search:** **Elasticsearch** (or Algolia).
    *   Fuzzy search for stores, products, and tags (handling typos like "Starbuks").
*   **Object Storage:** AWS S3 (or compatible) for storing store logos, banner images, and floor plan assets.

### **D. Intelligence & Analytics**
*   **Data Pipeline:**
    *   **Ingestion:** Events (clicks, scans, location pings) sent to a message queue (Kafka/RabbitMQ).
    *   **Processing:** Stream processing to anonymize and aggregate data.
    *   **Storage:** **ClickHouse** or Snowflake for OLAP (Online Analytical Processing) to handle massive scale analytics queries.
*   **AI Services (Microservice):**
    *   **Recommendation Agent:** Python/FastAPI service consuming user history to output "Stores you might like".
    *   **Vision (Future):** Processing CCTV feeds to count people (GDPR-compliant anonymous counting).

### **E. Authentication & Security**
*   **provider:** Clerk / Auth0 / NextAuth.
*   **Strategy:**
    *   **Shoppers:** Frictionless (Guest Mode per session OR simple SMS/Social Login).
    *   **Tenants/Admins:** Strict RBAC (Role-Based Access Control). Multi-factor authentication required for sensitive operational controls.

### **F. Deployment & Infrastructure**
*   **Host:** Vercel (Frontend) + AWS/Render (Backend Containers).
*   **CI/CD:** GitHub Actions. Automated testing (Jest/Cypress) before any deploy.
*   **Scalability:**
    *   **Horizontal:** Auto-scaling groups for Node.js containers based on CPU/RAM.
    *   **Database:** Read Replicas to handle high-read traffic during weekends/holidays.

---

## 3. Key Data Flows

### **Scenario 1: The "Digital Walk-In"**
1.  **Trigger:** User scans QR code at "North Entrance".
2.  **Frontend:** PWA launches with URL param `?location=north_entrance`.
3.  **Backend:** API validates location ID.
4.  **PostGIS:** Queries "What stores are nearest to North Entrance?".
5.  **Analytics:** Logs event `SCAN_QR` { location: 'North_Entrance', time: '...' }.
6.  **Response:** User sees a map centered on their location with immediate nearby amenities highlighted.

### **Scenario 2: The "Flash Sale" Trigger**
1.  **Tenant:** Creates "50% off Coffee" in Tenant Portal.
2.  **Backend:** Validates offer and determining target audience (e.g., "Shoppers currently inside Mall").
3.  **Real-Time Engine:** Pushes WebSocket event `NEW_OFFER` to active clients.
4.  **Shopper PWA:** Displays toast notification "🔥 50% off Coffee near you!".
