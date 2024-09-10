import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const apiKey = "d5lHaIxpT679swMAlL5acwRVAOq7uMxFfAkaoMEmKIdimzLwqusKbwmc";
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("cars");
  const [showImage, setShowImage] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); 

  async function loadImages(newSearch = false) {
    if (newSearch) {
      setData([]); 
      setPage(1);
    }
    setLoading(true);
    const res = await fetch(`https://api.pexels.com/v1/search?query=${searchQuery}&per_page=20&page=${page}`, {
      headers: {
        Authorization: apiKey,
      }
    });
    const response = await res.json();
    setData(prevData => newSearch ? response.photos : [...prevData, ...response.photos]);
    setLoading(false);
  }

  useEffect(() => {
    loadImages();
  }, [page]);

  const handleSearch = () => {
    loadImages(true);
  };

  const handleShow = (photo) => {
    setShowImage(true);
    setSelectedPhoto(photo);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="container">
      <div className="banner">
        <h1 className='heading'>SnapView Gallery</h1>
        <p className="summary">A sleek and modern photo gallery website that showcases stunning images with seamless navigation and a clean design, perfect for photographers and art lovers alike.</p>

        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='input'
            placeholder='Search Anything'
          />
          <button onClick={handleSearch} className='search-btn'>Search</button>
        </div>
      </div>

      <div className="image-gallery">
        {data.map((image, index) => (
          <div className="pics" onClick={() => handleShow(image)} key={index}>
            <img src={image.src.original} alt={image.alt} loading="lazy" />
          </div>
        ))}
      </div>

      {loading && <div className="loader-container"><span className="loader"></span></div>}

      {showImage && selectedPhoto && (
        <div className="image-page">
          <img src={selectedPhoto.src.original} className="image-page-img" alt={selectedPhoto.alt} />
          <button onClick={() => setShowImage(false)} className='close-btn'>X</button>
        </div>
      )}
    </div>
  );
}

export default App;
