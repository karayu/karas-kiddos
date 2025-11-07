# Setup Instructions

## Database Setup

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the entire contents of `supabase/schema.sql`
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" if it worked

## Storage Setup

1. In Supabase dashboard, go to "Storage"
2. Create a bucket named `checklists` (if you haven't already)
3. Make it public (enable public access)
4. Set up policies:
   - Public read access
   - Public insert access (or restrict to authenticated users for production)

## Verify Setup

After running the schema, you should have these tables:
- `content_items` (most important for checklists)
- `profiles`
- `children`
- `favorites`
- `engagement_events`
- `shares`
- `purchases`

You can verify by going to "Table Editor" in Supabase and checking if `content_items` exists.

