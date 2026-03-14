import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/system";

interface FetchingLoadingStatusProps {
  width?: string,
  height?: string,
  loading: boolean;
  text?: string;
  size?: number | string;
  color?: string;
  textOpacity?: number;
  className?: string;
  iconSx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
  fullScreen?: boolean;
}

const FetchingLoadingStatus = ({
  width = "auto",
  height = "auto",
  loading,
  text = "Processing...",
  size = 28,
  color = "white",
  textOpacity = 0.7,
  className = "",
  iconSx = {},
  containerSx = {},
  fullScreen = false,
}: FetchingLoadingStatusProps) => {
  if (!loading) return null;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/85 z-[9999]">
        <CircularProgress
          size={48}
          sx={{
            color: color === "white" ? "#2563eb" : color,
            ...iconSx,
          }}
        />
        <p className="mt-3 text-gray-700 text-sm">
          {text}
        </p>
      </div>
    );
  }

  return (
    <Box
      className={`flex items-center justify-center ${className}`}
      sx={{
        width: width,
        height: height,
        ...containerSx,
      }}
    >
      <CircularProgress
        size={size}
        sx={{
          color,
          ...iconSx,
        }}
      />
      <span
        className="ml-2 text-sm"
        style={{ color, opacity: textOpacity }}
      >
        {text}
      </span>
    </Box>
  );
};

export default FetchingLoadingStatus;
