import React, { useState, useEffect } from "react";

import { FormField, Loader, Card } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setloading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setsearchText] = useState("");
  const [SearchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setsearchTimeout] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setloading(true);

      try {
        const response = await fetch('https://dall-e-ev14.onrender.com/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if(response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
        
      } catch (error) {
        alert(error) 
      } finally {
        setloading(false);
      }

    }
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(e.target.value);

    setsearchText(e.target.value);

    setsearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()))
  
        setSearchedResults(searchResults);
      }, 500)
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Browse images generated by DALL-E AI
        </p>
      </div>

      <div className="mt-16">
        <FormField 
          labelName="Search posts"
          type= "text"
          name= "text"
          placeholder="Search posts"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards data={SearchedResults} title="No search results found" />
              ) : (
                <RenderCards data={allPosts} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
