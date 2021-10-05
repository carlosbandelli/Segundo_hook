import { useEffect, useState, useRef } from 'react';

/* eslint-disable */

const isObjectEqual = (objA, objB) => {
  return JSON.stringify(objA) === JSON.stringify(objB)
}

const useFetch = (url, options) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false)
  const [shouldLoad, setShouldload] = useState(false)
  const urlRef = useRef(url);
  const optionsRef = useRef(options)

  useEffect(() => {
    if (url !== urlRef.current){
      urlRef.current = url
      setShouldload((s) => !s)
    }
  },[url, options])

  useEffect(()=> {
    console.log('EFFECT', new Date().toLocaleString())
    console.log(optionsRef.current.headers)

    setLoading(true);

    const fetchData = async () => {
      await new Promise((r) => setTimeout(r, 3000))

      try {
        const response = await fetch(urlRef.current, optionsRef.current)
        const jsonResult = await response.json()
        setResult(jsonResult)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        throw e
      }      
    }

      fetchData();
   }, [shouldLoad])

  return[result, loading]
}

export const Home = () => {
  const [postId, setPostId] = useState('')
  const [result, loading] = useFetch('https://jsonplaceholder.typicode.com/posts' + postId, {
    headers: {
      abc: '2000000',
    },
  })

  useEffect(() => {
    console.log('ID do post', postId)
  }, [postId])

  if (loading) {
    return <p>Loading...</p>
  }

  const handleClick = (id) => {
    setPostId(id);
  }

  if (!loading && result) {
    return (
      <div>
        {result?.length > 0  ? (
          result.map ((p) => ( 
          <div key={`post-${p.id}`} onClick={() => handleClick(p.id)
          }>
            <p>{p.title}</p>
          </div>      
        )) 
        ) : (
          <div  onClick={() => handleClick('')
          }>
            <p>{result.title}</p>
          </div>      
        )}        
      </div>
    )
  }

  return <h1>Oi</h1>
}