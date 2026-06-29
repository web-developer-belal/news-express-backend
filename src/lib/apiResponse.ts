export const ApiResponse ={
    success:(data: any, message: string = "Request successful",metadata?: any) => {
        return {
            status: "success",
            message,
            data,
            metadata
        }
    },
    failure:(error: any, message: string = "Request failed",metadata?: any) => {
        return {
            status: "fail",
            message,
            error,
            metadata
        }
    },
    validationError:(errors: any, message: string = "Validation error",metadata?: any) => {
        return {
            status: "error",
            message,
            errors,
            metadata
        }
    }
}