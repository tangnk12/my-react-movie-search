import React from 'react'
import Search from './components/Search'
import { useEffect,useState } from 'react';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use';
import {getTrendingMovie, updateSearchCount} from './appwrite.js'

const API_BASE_URL='https://api.themoviedb.org/3';
const API_KEY= import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS={
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }

}

const App2 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const[errorMessage,setErrorMessage]=useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([]);


  useDebounce(()=>setDebouncedSearchTerm(searchTerm),500,[searchTerm])


 const fetchMovies = async (query='') => {
  setisLoading(true);
  setErrorMessage('');
  try {
    const endpoint = query?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    console.log("Fetching from endpoint:", endpoint);
    const response = await fetch(endpoint, API_OPTIONS);
    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response not ok:", errorText);
      throw new Error('Failed fetch movie');
    }
    const data = await response.json();
    console.log("Data received:", data);

    if (data.Response === 'False') {
      setErrorMessage(data.Error || 'Failed to fetch movies');
      setMovieList([]);
      return;
    }
    setMovieList(data.results || []);
    if(query&&data.results.length>0){
      await updateSearchCount(query,data.results[0]);
    }
    
  } 
  
  catch (error) {
    console.error(`Error fetching movies: ${error}`);
    setErrorMessage('Error fetching movies. Please try again later');
  } 
  
  finally {
    setisLoading(false);
  }
}

const loadTrendingMovies=async()=>{
  try{
    const tMovies=await getTrendingMovie();
    setTrendingMovies(tMovies);
   

  }
  catch(error){
    console.error(`Error fetching trending movie:${error}`)
  }
}

  useEffect(()=>{
//    console.log("API_BASE_URL:", API_BASE_URL);
// console.log("API_KEY:", API_KEY);
// const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
// console.log("Endpoint:", endpoint);
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

useEffect(()=>{
  loadTrendingMovies();

},[]);
  return (
    <main>
      <div className="pattern"> </div>

        <div className="wrapper">
          <header>
           <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">movie</span> You'll Enjoy Without the Hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
            {/* <h1 className="text-white">{searchTerm}</h1> */}

          </header>
          {trendingMovies.length>0&&(
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie,index)=>(
                  <li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title}></img>

                  </li>
                ))}
              </ul>


          </section>

          )

          }
          
          <section className="all-movies">
            <h2 >All Movies</h2>
            {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
            {isLoading?(
               <Spinner></Spinner>
              ):errorMessage?(<p className="text-red-500">{errorMessage}</p>
              ):(
              <ul>
                {movieList.map((movie)=>(
                  <MovieCard key={movie.id} movie={movie}>{movie.title}</MovieCard>

                ))}
              </ul>
            )
            }
            </section>
       

        </div>

     
    </main>
  )
}

export default App2