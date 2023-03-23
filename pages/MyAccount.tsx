import { useSession } from "next-auth/react"
import Link from "next/link"
import Layout from "../components/layout"

export default function MyAccount() {

    const { data: session, status } = useSession()
    const image: any = session?.user?.image

    if (!session) {
        return (
            <div>
                <p>Access denied</p>
                <Link href="/api/auth/signin">
                    <p>Sign in</p>
                </Link>
            </div>
        )
    }

    return (
        <Layout>
            <div>
                <h1 style={{color: 'var(--main-color)', fontSize: '50px'}} >My Account</h1> <br /> <br />
                <div style={{ display: 'flex' }} >

                    <div>
                        <img
                            src={image}
                            alt=""
                            width={100}
                            height={100}
                        />
                    </div>
                    <div style={{ marginLeft: '20px' }} >
                        <h3> Name : {session?.user?.name} </h3>
                        <h3> Email : {session?.user?.email} </h3>
                    </div>

                </div>
            </div>
        </Layout>
    )
}