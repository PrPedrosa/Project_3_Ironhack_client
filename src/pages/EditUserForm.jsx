import {useState, useContext} from 'react'
import axios from "axios"
import {AuthContext} from '../contexts/auth.context';
import {useNavigate} from "react-router-dom"
import loadingGif from "../images/loading-gif.gif"

function EditUserForm() {
    const {user, authenticateUser, storeToken, logout} = useContext(AuthContext)
    const storedToken = localStorage.getItem("authToken")

    const [name, setName] = useState(user.name)
    const [image, setImage] = useState(user.image)
    const [email, setEmail] = useState(user.email)
    const [sustainableFisherNumber, setSustainableFisherNumber] = useState(user.sustainableFisherNumber)
    const [loading, setLoading] = useState(false);

    const handleName = (e) => setName(e.target.value)
    const handleEmail = (e) => setEmail(e.target.value)
    const handleSustainableFisherNumber = (e) => setSustainableFisherNumber(e.target.value)

    const handleUpload = async (e) => {
        try {
          setLoading(true);
    
          //formData === enctype=multipart/formdata
          const uploadData = new FormData();
    
          //add the file to the formData
          uploadData.append('image', e.target.files[0]);
    
          //send the file to our api
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, uploadData);
    
          console.log(response.data.fileUrl);
          setImage(response.data.fileUrl);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
    };

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/edit/user/${user._id}`, {name, email, image, sustainableFisherNumber}, {
              headers: { Authorization: `Bearer ${storedToken}` },
            })
            storeToken(response.data.authToken);
            authenticateUser()
            
            setName("")
            setEmail("")
            setImage("")
            setSustainableFisherNumber("")
             
            navigate("/profile")
        } catch (error) {
            console.log(error)
        }
    }

    const deleteUser = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/delete/user/${user._id}`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            })
            logout()
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div className='form-box form-div'>
      <h1>Editar Dados</h1>
      <form onSubmit={handleSubmit} className='form-box form-form'>
        <label htmlFor="name">Nome</label>
        <input type="text" name='name' id='name' value={name} onChange={handleName}/>

        {/* <label htmlFor="image">Foto de Perfil:</label>
        <img src={image} alt="current" />
        <input type="file" name='image' id='image' onChange={handleUpload}/> */}


        <label htmlFor="email">Email</label>
        <input type="text" name='email' id='email' value={email} onChange={handleEmail}/>

        <label htmlFor="sustainableFisherNumber">Nº Cartão Pescador Sustentável</label>
        <input type="text" name='sustainableFisherNumber' id='sustainableFisherNumber' value={sustainableFisherNumber} onChange={handleSustainableFisherNumber}/>

        {/* {loading ? <p>Loading...</p> :<button type='submit'>Guardar alterações</button>} */}
        <label htmlFor="image" className='form-box'>
        <p>Imagem</p>
        {image ? 
        <>
          <img src={image} alt="current"/>
          <p className='small-buttons'>Alterar foto</p>
        </>
        : <i className="fa fa-3x fa-camera"><p>Adicionar Imagem</p></i>}
        <input type="file" name='image' id='image' onChange={handleUpload} className="image-input"/>
        </label>

        {!loading ? <button type="submit" className='buttons'>Guardar Alterações</button> : <img src={loadingGif} alt="loading" className='loading-gif'/>}
      </form>
      <p onClick={deleteUser} className="small-buttons logout">Apagar Conta</p>

    </div>
  )
}

export default EditUserForm