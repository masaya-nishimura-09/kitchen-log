export default function Information({ username }: { username: string }) {
  return (
    <div>
      <p className="text-md md:text-2xl font-bold">
        おかえりなさい、{username}さん
      </p>
    </div>
  )
}
