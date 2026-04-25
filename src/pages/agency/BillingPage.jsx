// Billing has been removed from this version of ClientLoop.
// This file redirects to dashboard to prevent any broken links.
import { Navigate } from 'react-router-dom';
export default function BillingPage() {
    return <Navigate to="/dashboard" replace />;
}