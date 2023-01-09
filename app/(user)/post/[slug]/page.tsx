import { groq } from "next-sanity"
import Image from "next/image"
import { client } from "../../../../lib/sanity.client"
import urlFor from "../../../../lib/urlFor"
import { PortableText } from "@portabletext/react"
import { RichTextComponents } from "../../../../components/RichTextComponents"


type Props = {
    params: {
        slug: string
    }
}

export const revalidate = 60

export async function generateStaticParams() {
  const query = groq`*[_type=='post']
  {
    slug
  }
  `
  const slugs: Post[] = await client.fetch(query)
  const slugRoutes = slugs.map((slug) => slug.slug.current)

  return slugRoutes.map(slug => ({
    slug
  }))
}

async function Post({params: {slug}}: Props) {
  const query = groq`
    *[_type=='post' && slug.current == $slug][0]
    {
        ...,
        author->,
        categories[]->
    }
  `

  const post: Post = await client.fetch(query, { slug })

  return (
    <article className="px-10 pb-28">
      <section className="space-y-2 border border-[#F7AB0A] text-white">
        <div className="relative min-h-56 flex flex-col md:flex-row justify-between">
          <div className="absolute top-0 w-full h-full opacity-10 p-10">
            <Image 
              className="object-cover object-center mx-auto"
              src={urlFor(post.mainImage).url()}
              alt={post.author.name}
              fill
            />
          </div>

          <section className="p-5 w-full">
            <div className="flex flex-col md:flex-row justify-between gap-y-5 items-center">
              <div className="">
                <h1 className="text-4xl font-extrabold text-black">
                  {post.title}
                </h1>

                <p className="text-black">
                    {new Date(post._createdAt).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      }
                    )
                    }
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4 justify-end">
                <Image 
                  className="rounded-full object-cover "
                  src={urlFor(post.author.image).url()}
                  alt={post.author.name}
                  height={40}
                  width={40}
                />
                <div className="w-64 text-black text-lg font-bold">
                    <h3>{post.author.name}</h3>
                </div>
              </div>
            </div>
            <div className="">
              <h2 className="text-black italic pt-10">{post.description}</h2>
              <div className="flex items-center md:flex-row justify-end mt-auto space-x-2">
                {post.categories.map(category => (
                  <div className="flex items-center md:flex-row bg=[#F7AB0A] px-3 py-1  " key={category._id}>
                    <Image
                      className="rounded-full object-cover"
                      src={urlFor(category.mainImage).url()}
                      alt={post.author.name}
                      width={40}
                      height={40}
                    />  
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <PortableText value={post.body} components={RichTextComponents}/>
    </article>
  )
}

export default Post