export const formatPrice = (n) =>
  '₦' + Number(n).toLocaleString('en-NG')

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'

export const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

export const statusColor = (s) => ({
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  paid:      'bg-blue-100 text-blue-700',
  new:       'bg-sky-100 text-sky-700',
  read:      'bg-gray-100 text-gray-600',
}[s] || 'bg-gray-100 text-gray-600')