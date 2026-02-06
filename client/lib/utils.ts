export const dataGridClassNames =
    "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
    return {
        "&.MuiDataGrid-root": {
            backgroundColor: isDarkMode ? "#1e1e20" : "white",
            color: isDarkMode ? "#e0e0e3" : "",
            borderColor: isDarkMode ? "#323235" : "",
        },
        "& .MuiDataGrid-columnHeaders": {
            color: isDarkMode ? "#e0e0e3" : "",
            '& [role="row"] > *': {
                backgroundColor: isDarkMode ? "#252528" : "white",
                borderColor: isDarkMode ? "#323235" : "",
            },
        },
        "& .MuiIconButton-root": {
            color: isDarkMode ? "#9a9a9e" : "",
        },
        "& .MuiTablePagination-root": {
            color: isDarkMode ? "#9a9a9e" : "",
        },
        "& .MuiTablePagination-selectIcon": {
            color: isDarkMode ? "#9a9a9e" : "",
        },
        "& .MuiDataGrid-cell": {
            border: "none",
            color: isDarkMode ? "#e0e0e3" : "",
        },
        "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${isDarkMode ? "#323235" : "#e5e7eb"}`,
            "&:hover": {
                backgroundColor: isDarkMode ? "#2a2a2d" : "",
            },
            "&.Mui-selected": {
                backgroundColor: isDarkMode ? "#2a2a2d" : "",
                "&:hover": {
                    backgroundColor: isDarkMode ? "#323235" : "",
                },
            },
        },
        "& .MuiDataGrid-withBorderColor": {
            borderColor: isDarkMode ? "#323235" : "#e5e7eb",
        },
        "& .MuiDataGrid-footerContainer": {
            backgroundColor: isDarkMode ? "#252528" : "white",
            borderColor: isDarkMode ? "#323235" : "",
        },
        "& .MuiDataGrid-overlay": {
            backgroundColor: isDarkMode ? "rgba(22, 22, 24, 0.8)" : "",
            color: isDarkMode ? "#e0e0e3" : "",
        },
        "& .MuiDataGrid-sortIcon": {
            color: isDarkMode ? "#9a9a9e" : "",
        },
        "& .MuiDataGrid-menuIconButton": {
            color: isDarkMode ? "#9a9a9e" : "",
        },
        "& .MuiDataGrid-columnSeparator": {
            color: isDarkMode ? "#323235" : "",
        },
    };
};
