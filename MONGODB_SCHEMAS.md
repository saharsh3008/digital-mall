# Digital Mall OS - MongoDB Schema Design

*Designed for high-read/write scaling using MongoDB's document model. Includes geospatial support for map features.*

## 1. Core Schemas

### **User Collection**
*Storage for all actors: Shoppers, Tenant Managers, and Admins.*
```javascript
const UserSchema = new Schema({
  _id: ObjectId,
  email: { type: String, unique: true, index: true }, // Index for fast login
  role: { 
    type: String, 
    enum: ['shopper', 'tenant_manager', 'admin'], 
    default: 'shopper' 
  },
  
  // Profile (Polymorphic Pattern)
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatarUrl: String,
    
    // Shopper Specific
    preferences: [String], // ["fashion", "tech"]
    savedStoreIds: [{ type: ObjectId, ref: 'Store' }],
    
    // Tenant Manager Specific
    managedStoreId: { type: ObjectId, ref: 'Store' } 
  },

  // Auth
  authProvider: String, // 'google', 'email'
  createdAt: Date,
  lastActiveAt: Date
});
```

### **Store Collection**
*The digital twin of the physical shop. Heavily indexed for search and location.*
```javascript
const StoreSchema = new Schema({
  _id: ObjectId,
  tenantId: { type: ObjectId, ref: 'User' }, // Owner
  
  // Identity
  name: { type: String, index: "text" }, // Text index for search
  slug: { type: String, unique: true },
  category: { type: String, index: true }, // e.g., "Fashion", "Dining"
  description: String,
  logoUrl: String,
  heroImageUrl: String,

  // Location (GeoJSON)
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    floorLevel: { type: Number, index: true },
    unitNumber: String
  },

  // Operations
  isOpen: Boolean,
  operatingHours: {
    mon: { open: String, close: String },
    tue: { open: String, close: String },
    // ...
  },
  
  // Optimization (Computed fields)
  averageRating: { type: Number, default: 0 },
  activeOfferCount: { type: Number, default: 0 }
});

// Indexes
// 1. Geospatial index for "Stores near me"
StoreSchema.index({ location: "2dsphere" }); 
// 2. Compound index for Directory filtering
StoreSchema.index({ category: 1, floorLevel: 1 });
```

### **Event Collection**
*Mall-wide happenings (Concerts, Santa visits).*
```javascript
const EventSchema = new Schema({
  _id: ObjectId,
  title: String,
  description: String,
  bannerUrl: String,
  
  // Scheduling
  startDate: { type: Date, index: true },
  endDate: { type: Date, index: true },
  
  // Location
  locationName: String, // "Central Atrium"
  floorLevel: Number,

  // Targeting
  tags: [String]
});
```

### **Offer Collection**
*Time-sensitive coupons created by Tenants.*
```javascript
const OfferSchema = new Schema({
  _id: ObjectId,
  storeId: { type: ObjectId, ref: 'Store', index: true },
  
  title: String, // "50% off Coffee"
  description: String,
  code: String, // "SAVE50"
  qrCodeUrl: String,

  // Lifecycle
  validFrom: Date,
  validUntil: { type: Date, index: true }, // TTL Index candidate
  isActive: { type: Boolean, default: true },

  // Limits
  redemptionLimit: Number,
  redemptionCount: { type: Number, default: 0 }
});

// TTL Index: Automatically delete expired offers after 30 days
OfferSchema.index({ validUntil: 1 }, { expireAfterSeconds: 2592000 });
```

---

## 2. Growth & Engagement Schemas

### **Loyalty Collection**
*Transaction ledger for points.*
```javascript
const LoyaltyTransactionSchema = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', index: true },
  storeId: { type: ObjectId, ref: 'Store' }, // Optional (if mall-wide)
  
  type: { type: String, enum: ['earn', 'burn'] },
  points: Number,
  reason: String, // "Scanned Receipt #123"
  
  metadata: {
    receiptId: String,
    receiptAmount: Number
  },

  createdAt: { type: Date, default: Date.now }
});
```

### **AI Interaction Log**
*Standard collection for auditing/improving AI.*
```javascript
const AIInteractionSchema = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', index: true },
  
  prompt: String,
  response: String,
  contextUsed: Object, // { location: [lat, lng], nearbyStores: [...] }
  tokensUsed: Number,
  model: String, // "gpt-4-turbo"

  feedback: { type: Number, min: 1, max: 5 }, // User rating of answer
  timestamp: { type: Date, default: Date.now }
});
```

### **Analytics Events (Time-Series)**
*High-volume write collection for clickstream data.*
```javascript
const AnalyticsEventSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  metadata: {
    userId: ObjectId,
    sessionId: String,
    device: String
  },
  event: String, // "view_store", "search_directory"
  properties: Object // { storeId: "...", query: "coffee" }
}, {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "seconds"
  }
});
```

---

## 3. Scaling Considerations

### **Sharding Strategy**
1.  **Users:** Shard by `_id`. Users are accessed randomly.
2.  **Analytics:** Shard by `timestamp` (for time-based partitioning) or `metadata.userId` (to keep user data together).
3.  **Stores/Events:** Unlikely to need sharding (dataset is small, <1000 stores per mall). Replicate heavily for Read performance.

### **Performance Tuning**
1.  **Read Patterns:** Most queries are "Get all stores on Floor 1" or "Find stores near [lat, lng]".
    *   *Solution:* Use Projection to return only needed fields (name, slug, logo) on list views.
    *   *Solution:* Lean heavily on the `2dsphere` index for location queries.
2.  **Write Patterns:** Analytics write throughput will be high.
    *   *Solution:* Use MongoDB **Time Series Collections** (defined above) which are optimized for high-ingestion rates and compression.
