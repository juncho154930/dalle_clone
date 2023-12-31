import { useState, useEffect, ChangeEvent } from 'react'

import { Loader, Card, FormField } from '../components'

interface RenderCardsProps {
  data: any[]
  title: string
}

const RenderCards = ({ data, title}: RenderCardsProps) => {
  if(data?.length > 0) return data.map((post) => <Card key={post.id} {...post} />)
  return <h2 className='mt-5 font-bold text-[#6469ff] text-xl uppercase'>{title}</h2>
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [searchText, setSearchText] = useState("")
  const [searchedResults, setSearchedResults] = useState<any[]>([])
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      
      try {
        const response = await fetch('https://dall-e-jv2y.onrender.com/api/v1/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if(response.ok) {
          const result = await response.json()
          setAllPosts(result.data.reverse())
        }
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTextValue = e.target.value
    clearTimeout(searchTimeout);
    setSearchText(searchTextValue);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => 
        {
          return item.name.toLowerCase().includes(searchTextValue.toLowerCase()) || 
          item.prompt.toLowerCase().includes(searchTextValue.toLowerCase())
        });
        setSearchedResults(searchResult);
      }, 500),
    );
  }
  

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>The Community Showcase</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Browse through a collection of imaginative and visually stunning images generated by DALL-E AI
        </p>
      </div>

      <div className="mt-16">
        <FormField 
          labelName="Search Posts"
          type="text"
          name="text" 
          placeholder="Search posts"
          value={searchText} 
          handleChange={handleSearchChange} 
        /> 
      </div>

      <div className='mt-10'>
        {
          loading ? (
            <div className='flex justify-center items-center'>
              <Loader />
            </div>
          ) : 
          <>
            {searchText && (
              <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                Showing results for <span className='text-[#222328]'>{searchText}</span>
              </h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {searchText ? (
                <RenderCards 
                  data={searchedResults}
                  title="No search results found"
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title="No posts found" 
                />
              )}
            </div>
          </>
        }
      </div>
    </section>
  )
}

export default Home