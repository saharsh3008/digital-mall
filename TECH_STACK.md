# Digital Mall OS - Recommended Tech Stack

*Optimized for: Speed of delivery, AI-readiness, and Geospatial capabilities.*

## 1. The Core Stack (The "Happy Path")
**This stack allows a small team to move at lightning speed while remaining scalable.**

| Layer | Technology | Why this choice? | Tradeoffs |
| :--- | :--- | :--- | :--- |
| **Language** | **TypeScript** | Shared types between Frontend/Backend ensures strict contracts and fewer bugs. | Requires compile step (setup handled by frameworks). |
| **Frontend** | **Next.js 14 (App Router)** | Best-in-class performance, SEO (crucial for Tenant discovery), and Vercel ecosystem speed. | High dependency on Vercel infrastructure (vendor lock-in risk). |
| **Styling** | **Tailwind CSS + shadcn/ui** | Copy-paste premium components. Extremely fast UI iteration for the "Wow" factor. | specific class-name syntax (learning curve for standard CSS devs). |
| **Database** | **Supabase (PostgreSQL)** | "Firebase for SQL". Gives us Auth, Realtime, and **PostGIS** (Maps) out of the box. | Relational databases are harder to migrate schema-wise than NoSQL (MongoDB). |
| **AI** | **Vercel AI SDK** | Stream standard LLM responses directly to UI components easily. | Abstraction layer covers some low-level controls. |

---

## 2. Specialized Components

### **A. Geospatial & Maps**
*   **Recommendation:** **Mapbox GL JS**.
*   **Why:** The gold standard for vector maps. Allows custom "Dark Mode" styling to match the mall's brand. Supports 3D content for future "Digital Twin" features.
*   **Tradeoff:** Expensive at massive scale compared to OpenStreetMaps/Leaflet.

### **B. Backend & API**
*   **Recommendation:** **Next.js Server Actions** (for MVP) -> **NestJS** (for Scale).
*   **Why:** Start by keeping backend logic inside Next.js to avoid context switching. Extract to a dedicated Node/NestJS service only when complexity demands it.
*   **Tradeoff:** Server Actions can get messy if not organized well.

### **C. AI & Search Pipeline**
*   **Recommendation:** **pgvector** (within Supabase) + **OpenAI API**.
*   **Why:** Keep vector embeddings (for semantic search like "Show me red shoes") in the *same* database as your product inventory. simplifies infrastructure massively.
*   **Tradeoff:** Dedicated Vector DBs (Pinecone) might be faster at millions of vectors, but purely for mall inventory, Postgres is sufficient.

---

## 3. Infrastructure & Deployment

*   **Hosting:** **Vercel** (Frontend/Edge) + **Supabase** (Data).
*   **Auth:** **Clerk**.
    *   *Why:* Better UX than building own auth. Handles 2FA and Enterprise SSO (needed for Mall Admin security) automatically.
*   **Analytics:** **PostHog**.
    *   *Why:* Open-source, handles product analytics (clicks) and session recording (seeing how users struggle with the map).

---

## 4. Why this stack for you? (The Founder's View)

1.  **Speed:** You are using "batteries included" tools (Supabase, Clerk, Shadcn). You won't waste weeks writing boilerplate auth or database connection code.
2.  **Scale:** PostgreSQL is battle-tested. It will not bottleneck until you have millions of users.
3.  **AI Native:** Storing data in Postgres with `pgvector` means you can add features like "Chat with the Mall" ("Where can I buy a gift for my dad?") simply by querying your existing database. 
