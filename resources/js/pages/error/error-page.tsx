import { Button } from '@/components/ui/button'
import { Head, usePage } from '@inertiajs/react'

export default function ErrorPage() {
  const props = usePage().props as Record<string, any>;
  const status = props.status ?? 500

  const title =
    status === 404
      ? 'Page Not Found'
      : status === 403
        ? 'Access Denied'
        : 'An Error Occurred';

  const description =
    status === 404
      ? 'The page you are looking for could not be found.'
      : status === 403
        ? 'You do not have permission to access this page.'
        : 'We are experiencing issues. Please try again later.';


  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
        <h1 className="text-6xl font-extrabold mb-2">{status}</h1>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-muted-foreground max-w-md mb-8">{description}</p>
        <Button onClick={() => (window.location.href = '/')}>Back To Home</Button>
      </div>
    </>
  )
}
