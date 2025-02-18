import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Input, Slide, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function UploadMedia(props) {
    const {
        open,
        setOpen,
        files,
        setFiles,
        previews,
        setPreviews,
        onSubmit
    } = props;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        console.log('files:', selectedFiles)
        console.log('files array:', selectedFiles)
        setFiles(selectedFiles);

        if (selectedFiles.length > 0) {
            const newObjectUrls = selectedFiles.map(selectedFile => {
                console.log('selectedFile:', selectedFile)
                return URL.createObjectURL(selectedFile);
            });
            console.log('newObjectUrls:', newObjectUrls)
            setPreviews(newObjectUrls);
            // setPreviews(prev => {
            //     return [prev, newObjectUrls]
            // });
        }
    }

    const handleRemovePreview = (index) => {
        console.log('index:', index)
        const newPreviews = [...previews];
        console.log('newPreviews bef:', newPreviews)
        newPreviews.splice(index, 1);
        console.log('newPreviews aft:', newPreviews)
        setPreviews(newPreviews);

        const newFiles = [...files];
        console.log('newfiles bef:', newFiles)
        newFiles.splice(index, 1);
        console.log('newfiles aft:', newFiles)
        setFiles(newFiles);
    }
    return (
        <Dialog
            open={open==='uploadNew'}
            TransitionComponent={Transition}
            // slots={transition}
            keepMounted
            onClose={e => {
                setOpen('');
            }}
            sx={{ maxWidth: 'lg' }}
        >
            <DialogTitle>
                <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Upload Media</Typography>
            </DialogTitle>
            <DialogContent sx={{ width: '500px', maxWidth: 'lg' }}>
                <Box sx={{ textAlign: 'center', margin: '20px 0' }}>
                    <input
                        type="file" accept="image/*,video/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        multiple
                        id="upload-button"
                    />
                    <label htmlFor="upload-button">
                        <Button variant="contained" component="span" sx={{ marginBottom: '10px' }}>
                            Select Files
                        </Button>
                        {/* <Button onClick={() => console.log(previews)}>preview</Button>
                        <Button onClick={() => console.log(files)}>files</Button> */}
                    </label>
                    <Box sx={{ mt: '10px', display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px' }}>
                        {/* <Typography variant="subtitle1">Previews:</Typography> */}
                        {
                            files && previews && files.length > 0 && files.map((file, index) => (
                                <Box sx={{ flex: '0 0 auto' }}>
                                    {file.type.startsWith('image/') ? (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img src={previews[index]} alt="preview" style={{ width: '120px', height: '120px', }} />
                                            <IconButton
                                                size="small"
                                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                                onClick={() => handleRemovePreview(index)}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                    ) : (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <video src={previews[index]} alt="preview" controls style={{ width: '120px', height: '120px', }} />
                                            <IconButton
                                                size="small"
                                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                                onClick={() => handleRemovePreview(index)}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                    )}
                                </Box>
                            ))
                        }
                    </Box>
                    <Button variant='outlined' sx={{ backgroundColor: '#fff', color: 'green'}} onClick={()=>onSubmit()}>Upload</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default UploadMedia;