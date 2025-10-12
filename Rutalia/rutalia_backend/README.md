## Rutalia API (Node.js + Express)

### Requirements

- Node.js 20+
- MongoDB instance (local or remote)

### Install & run

```sh
npm install
npm run dev        # start with hot-reload (tsx)
npm run build      # emit JS to dist/
npm start          # run the compiled bundle
```

### Environment

Copy `.env.example` to `.env` and populate the required secrets:

- `MONGO_URI`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- Optional providers: Firebase (`FIREBASE_*`) and Cloudinary (`CLOUDINARY_*`)

The service exposes the REST API on the port configured by `PORT` (default `4000`).

### Tracking endpoint

`POST /tracking`

```json
{
  "routeId": "ruta0_beso_judas",
  "milestoneId": "ruta0_m1",
  "location": { "type": "Point", "coordinates": [2.1744, 41.4036] },
  "eventType": "reach"
}
```

Requires a valid Bearer access token issued by the auth service.
