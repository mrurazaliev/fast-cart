import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => (
  <section className="space-y-5 rounded-lg border bg-background p-8">
    <h1 className="text-2xl font-semibold">Page not found</h1>
    <p className="text-muted-foreground">This admin page does not exist.</p>
    <Button asChild>
      <Link to="/products">Back to products</Link>
    </Button>
  </section>
)

export default NotFound
