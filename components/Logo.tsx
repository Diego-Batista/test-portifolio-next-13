import Image from "next/image"

function Logo(props: any) {
    const { renderDefault, title } = props

  return (
    <div className="flex items-center space-x-2">
        <Image
            className="rounded-full object-cover"
            height={50}
            width={50}
            src="https://avatars.githubusercontent.com/u/68654450?s=96&v=4"
            alt="Logo"
        />
        {renderDefault && <>{renderDefault(props)}</>}
    </div>
  )
}

export default Logo