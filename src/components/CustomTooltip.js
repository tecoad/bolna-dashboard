import { IconButton, Tooltip } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const renderTooltip = (title) => (
    <Tooltip title={title}>
        <IconButton aria-label="info">
            <HelpOutlineIcon />
        </IconButton>
    </Tooltip>
);