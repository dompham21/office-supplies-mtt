import { useProfileQuery } from "@data/profile/use-profile.query";
import { useEffect, useState } from "react";

const useAuthenticated = () => {
    const [isAuth, setIsAuth] = useState(true)

    const {
        data,
        isLoading: loading,
        error,
    } = useProfileQuery()

    useEffect(()=> {
        if(!loading && data) {
            setIsAuth(true)
        }
        else if(!loading && !data) {
            setIsAuth(false)
        }
    },[data, loading])

    return {isAuth}
}

export default useAuthenticated;