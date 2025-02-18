import React, { useContext, useEffect, useState } from 'react'
import UploadMedia from '../components/UploadMedia'
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material'
import { config } from '../config/apiConfig';
import authAxios from '../config/axiosConfig';
import Gallery from '../components/Gallery';
import AuthContext from '../context/AuthContext';

function Home() {
  const {state, dispatch} = useContext(AuthContext);
  const user = state.user;
  const userMedia = state.userMedia;
  const totalRecords = state.totalRecords;
  const lastPage = state.lastPage;
  const [files, setFiles] = useState(null);

  const [open, setOpen] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previews, setPreviews] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
    
  // const [userMedia, setUserMedia] = useState({
  //   images: [],
  //   videos: []
  // });
  // const [userMedia, setUserMedia] = useState([]);

  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  const uploadNewMedia = async () => {
    try {
      const formdata = new FormData();
      files.length > 0 && files.forEach((file, index) => {
        formdata.append(`files`, file);
      });
      // formdata.append('files', files.map(f => f))
      const res = await authAxios.post(`${config.baseUrl}/api/v1/media/upload`, formdata);
      console.log('red upload:', res)
      if(res.status == 201) {
        setOpen('');
        setFiles(null);
        setPreviews(null);
        fetchUserFiles('after upload');
      }
    } catch (error) {
      console.error('error while uploading media', error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    }
  }

  const fetchUserFiles = async () => {
    try {
      const res = await authAxios.get(`${config.baseUrl}/api/v1/media/fetch?page=${page}&limit=${limit}`);
      console.log('res fetch:', res)
      const files = res.data.data;
      // setUserMedia(files);
      dispatch({
        type: 'STORE_USER_MEDIA',
        payload: {
          files,
          totalRecords: res.data.total,
          lastPage: res.data.lastPage
        }
      });
    } catch (error) {
      console.error('error while fetching user files', error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    }
  }

  const handleDeleteUserFile = async (fileId) => {
    // console.log('file id:', fileId)
    try {
      const res = await authAxios.delete(`${config.baseUrl}/api/v1/media/delete/${fileId}`);
      if(res.status == 200) {
        setOpen('');
        dispatch({ type: 'DELETE_USER_FILE', payload: {fileId} })
      }
    } catch (error) {
      console.error('failed to delete file', error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    }
  }

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  }

  // useEffect(() => {
  //   fetchUserFiles();
  // }, [state.isAuth]);

  useEffect(() => {
    fetchUserFiles();
  }, [page]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Typography variant='h6' sx={{ mr: 2 }}>Welcome {user.name}</Typography>
        <Button onClick={()=>setOpen('uploadNew')} variant='contained' sx={{ mr: 2 }}>upload new media</Button>
        <Button onClick={()=>dispatch({ type: 'LOGOUT' })} variant='contained' sx={{}}>Logout</Button>
      </Box>
        <UploadMedia 
          open={open}
          setOpen={setOpen}
          files={files}
          setFiles={setFiles}
          previews={previews}
          setPreviews={setPreviews}
          onSubmit={uploadNewMedia}
        />
        <Gallery 
          userMedia={userMedia}
          onDelete={handleDeleteUserFile}
          open={open}
          setOpen={setOpen}
          page={page}
          limit={limit}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          lastPage={lastPage}
        />
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          // message={errorMessage}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
      </Snackbar>
    </Box>
  )
}

export default Home