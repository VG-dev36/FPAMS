import {
    TextField
} from "@mui/material";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar = ({
    value,
    onChange,
}: Props) => {
    return (
        <TextField
            fullWidth
            size="small"
            label="Search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default SearchBar;