# Canada Backend

## Project Structure

```
src/
  config/
    db.js
  controllers/
    user.controller.js
  models/
    user.model.js
  routes/
    index.js
    user.routes.js
    clerkWebhook.routes.js
    stripeWebhook.routes.js
  app.js
.env
.gitignore
package.json
README.md
```

## Usage

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Main entry: `src/app.js`

## Notes

- All business logic in `controllers/`
- All models in `models/`
- All routes in `routes/`
