import { supabase } from "@/utils/supabase/supabase";



type PageProps = {
  params: {
    memberId: string
  }
}

export default  async function MemberId({ params }: PageProps){

return(
    <>
    <h1>ユーザー情報</h1>
    </>
)
}