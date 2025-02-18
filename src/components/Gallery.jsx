import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Pagination, Typography } from '@mui/material'
import React, { useState } from 'react'
import { config } from '../config/apiConfig';
import DeleteIcon from '@mui/icons-material/Delete';

function Gallery(props) {
    const {
        userMedia,
        onDelete,
        open,
        setOpen,
        page,
        limit,
        onPageChange,
        totalRecords,
        lastPage
    } = props;

    const [selectedFile, setSelectedFile] = useState(null);
    
    const handleImageClick = (filePath) => {
        const imgElement = document.createElement('img');
        imgElement.src = `${config.baseUrl}/${filePath}`;
        imgElement.style.width = '100%';
        imgElement.style.height = '100%';
        imgElement.style.objectFit = 'contain';
    
        const fullScreenDiv = document.createElement('div');
        fullScreenDiv.style.position = 'fixed';
        fullScreenDiv.style.top = '0';
        fullScreenDiv.style.left = '0';
        fullScreenDiv.style.width = '100%';
        fullScreenDiv.style.height = '100%';
        fullScreenDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        fullScreenDiv.style.display = 'flex';
        fullScreenDiv.style.alignItems = 'center';
        fullScreenDiv.style.justifyContent = 'center';
        fullScreenDiv.style.zIndex = '1000';
        fullScreenDiv.onclick = () => {
            document.body.removeChild(fullScreenDiv);
        };
    
        fullScreenDiv.appendChild(imgElement);
        document.body.appendChild(fullScreenDiv);
    };
    
  return (
    <Box sx={{ p: 2 }}>
        <Typography variant='h4'>
            Media Gallery
        </Typography>
        {/* <Button onClick={()=>console.log(userMedia)}>media</Button> */}
        <Grid container spacing={2}>
            {
                userMedia && userMedia.length === 0 &&
                 <Grid item xs={12}>
                    <Typography variant="h6" align="center" color="textSecondary">
                        There is no media present. Start uploading now!
                    </Typography>
                </Grid>
            }
            {
                userMedia && userMedia.length > 0 && userMedia.map((file, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index} 
                    sx={{ 
                        // width: '250px', height: '250px', objectFit: 'cover', position: 'relative', 
                        mb: 3}}>
                        {
                            file.fileType === 'image' ? (
                                <img 
                                    src={`${config.baseUrl}/${file.filePath}`} 
                                    alt={file.title} 
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }} 
                                    onClick={() => handleImageClick(file.filePath)}
                                />
                            ) : (
                                <video src={`${config.baseUrl}/${file.filePath}`} controls style={{ width: '100%', height: '200px' }} />
                            )
                        }
                        <IconButton
                            size="small"
                            sx={{  }}
                            onClick={() => {
                                setOpen('deleteConfirm');
                                setSelectedFile(file);
                            }}
                        >
                            <DeleteIcon sx={{ color: 'red'}} />
                        </IconButton>
                    </Grid>
                ))
                // {
                //     return (
                //         {
                //             file.fileType === 'image'
                //         }
                //         <Grid item xs={6} sm={4} md={3} key={index}>
                //             <img src={`${config.baseUrl}/${image.filePath}`} alt={image.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                //         </Grid>
                //     )
                // })
            }
        </Grid>
        {
            userMedia && userMedia.length > 0 && 
            <Pagination count={lastPage} page={page} onChange={onPageChange} />
        }
        <Dialog
            open={open === 'deleteConfirm'}
            onClose={() => setOpen('')}
        >
            <DialogTitle>Are you sure you want to delete this file?</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this file?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen('')}>Cancel</Button>
                <Button onClick={() => onDelete(selectedFile._id)}>Delete</Button>
            </DialogActions>
        </Dialog>
    </Box>
  )
}

export default Gallery