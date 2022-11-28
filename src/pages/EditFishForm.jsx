import {useState, useEffect, useContext} from 'react'
import axios from "axios"
import {AuthContext} from '../contexts/auth.context';
import {useNavigate, useParams} from "react-router-dom"

function EditFishForm() {
    const {user} = useContext(AuthContext)
    const {fishId} = useParams()

    const [commonName, setCommonName] = useState("")
    const [image, setImage] = useState("")
    const [areaFound, setAreaFound] = useState("")
    const [weight, setWeight] = useState(0)
    const [length, setLength] = useState(0)
    const [loading, setLoading] = useState(false);

    const handleCommonName = (e) => setCommonName(e.target.value)
    const handleAreaFound = (e) => setAreaFound(e.target.value)
    const handleWeight = (e) => setWeight(+(e.target.value))
    const handleLength = (e) => setLength(+(e.target.value))
    const handleUpload = async (e) => {
        try {
          setLoading(true);
    
          //formData === enctype=multipart/formdata
          const uploadData = new FormData();
    
          //add the file to the formData
          uploadData.append('image', e.target.files[0]);
    
          //send the file to the api
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, uploadData);
    
          console.log(response.data.fileUrl);
          setImage(response.data.fileUrl);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
    };

    const getFish = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/fishes/${fishId}`);
    
          const {commonName, image, weight, length, areaFound} = response.data
            setCommonName(commonName)
            setImage(image)
            setWeight(weight)
            setLength(length)
            setAreaFound(areaFound)

        } catch (error) {
          console.log(error);
        }
    };
    useEffect(() => {getFish()}, [])

    const deleteFish = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/fishes/${fishId}/${user._id}`)
            navigate("/profile")
            //do toastify?
        } catch (error) {
            console.log(error)
        }
    }

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newFish = await axios.put(`${process.env.REACT_APP_API_URL}/fishes/${fishId}`, {commonName, image, areaFound, weight, length})
            console.log(newFish)
            
            setCommonName("")
            setImage("")
            setWeight(0)
            setAreaFound("")
            setLength(0)
            
            navigate("/profile")
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div>
       <h1>Editar Troféu</h1>
       <button onClick={deleteFish}>Apagar Troféu</button>
    <form onSubmit={handleSubmit}>
        <label htmlFor="commonName">Espécie:</label>
        <input type="text" name='commonName' id='commonName' value={commonName} onChange={handleCommonName}/>

        <label htmlFor="image">Foto:</label>
        {image && <img src={image} alt="current"/>}
        <input type="file" name='image' id='image' onChange={handleUpload}/>

        <label htmlFor="areaFound">Localização:</label>
        <input type="text" name='areaFound' id='areaFound' value={areaFound} onChange={handleAreaFound}/>

        <label htmlFor="weight">Peso:</label>
        <input type="number" name='weight' id='weight' value={weight} onChange={handleWeight}/>

        <label htmlFor="length">Tamanho:</label>
        <input type="number" name='length' id='length' value={length} onChange={handleLength}/>

        {!loading ? <button type="submit">Submeter</button> : <p>A carregar imagem...</p>}
    </form>


    </div>
  )
}

export default EditFishForm