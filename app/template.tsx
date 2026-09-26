/** Re-mounts per navigation, giving each route a light CSS enter transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
