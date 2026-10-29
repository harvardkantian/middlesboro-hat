import { UploadFile } from "@mui/icons-material"
import { Button, Dialog, DialogTitle } from "@mui/material"

const UploadModal = ({visibility, setVisibility}) => {
  return (
    <Dialog open={visibility} onClose={setVisibility}>
        <DialogTitle>Upload XLSX</DialogTitle>
        <Button startIcon={<UploadFile />} variant="contained">Upload XLSX</Button>
    </Dialog>
  )
}
export default UploadModal