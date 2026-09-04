# Spring Boot Backend (Outline) for PeerTask

Drop-in REST endpoints mirroring the frontend's localStorage models. Swap
`Store` calls in `app.js` with `fetch('/api/...')` to migrate.

## 1. Maven dependency (pom.xml)

```xml
<dependencies>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
  <dependency><groupId>com.h2database</groupId><artifactId>h2</artifactId><scope>runtime</scope></dependency>
  <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
</dependencies>
```

## 2. Endpoints

### `SkillController` — `/api/skills`
- `GET    /api/skills?q=&filter=All|Barter|Paid&category=&location=` → `List<Skill>`
- `GET    /api/skills/{id}` → `Skill`
- `POST   /api/skills` → 201 `Skill`
- `PUT    /api/skills/{id}` → `Skill`
- `DELETE /api/skills/{id}` → 204

### `BookingController` — `/api/bookings`
- `GET    /api/bookings?user=You` → `List<Booking>`
- `POST   /api/bookings` → 201 `Booking`
- `PATCH  /api/bookings/{id}/status` → `Booking` (status: Pending|Accepted|Completed|Cancelled)
- `GET    /api/bookings/stats?user=` → `{ skillsOffered, servicesBooked, trustScore, reviews }`

## 3. DTOs (sketch)

```java
public record SkillRequest(
    @NotBlank @Size(min = 3) String name,
    @NotBlank String category,
    @NotBlank String location,
    @NotBlank @Pattern(regexp = "Barter|Paid|Both") String offerType,
    String details,
    String postedBy) {}

public record BookingRequest(
    @NotBlank String skillId,
    String note,
    @NotBlank @Pattern(regexp = "Barter|Direct Paid") String type) {}

public record StatusUpdateRequest(
    @NotBlank @Pattern(regexp = "Pending|Accepted|Completed|Cancelled") String status) {}
```

## 4. Trust Score formula (service layer)

```java
int completed = bookings.stream().filter(b -> "Completed".equals(b.status())).count();
int score = Math.min(100, completed * 12 + completed * 3);
```

## 5. Frontend swap

Replace `Store.persist()` calls with:

```js
const API = '/api';
async function apiGet(url) { return fetch(API + url).then(r => r.json()); }
async function apiSend(url, method, body) {
  return fetch(API + url, {
    method, headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  }).then(r => r.json());
}
```

Wire into `app.js`:
- `POST /api/skills` from `SkillForm.submit`
- `GET  /api/skills?q=&filter=` from `Hire.render`
- `POST /api/bookings` from `Modal.handleConfirm`
- `PATCH /api/bookings/{id}/status` from `Dashboard.setBookingStatus`
- `GET  /api/bookings/stats` for `Hero`/dashboard counters

## 6. CORS / production

- Restrict `allowedOrigins` to your deployed frontend URL.
- Put behind HTTPS with a reverse proxy (nginx, Cloudflare).
- Use a managed Postgres (Supabase, Neon, Railway) for persistence.
