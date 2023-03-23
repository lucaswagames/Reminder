import { useState, useEffect } from "react"
import Layout from "../../components/layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
// @ts-ignore
import { Group, GroupUsers } from "@/interfaces"
import Head from "next/head"

export default function GroupPage() {
    const { data: session } = useSession()
    const [groups, setGroups] = useState([])
    const [groupUsers, setGroupUsers] = useState([])
    const router = useRouter();

    async function handleSubmit(e: any) {
        e.preventDefault()
        const { name, description, image } = e.target.elements
        createOneGroup(name.value, description.value, image.value);
    }

    async function createOneGroup(name: string, description: string, image: string) {
        const response = await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                image,
            }),
        })

        try {
            const data = await response.json()
            console.log(data.group)
            let userIdEmail: any = session?.user?.email
            postGroupUser(data.group.id, userIdEmail);
            // On vide le formulaire
            document.querySelector("form")?.reset();
            getGroups().then((groups) => {
                setGroups(groups)
            })
            return data.group || [];
        }
        catch (error) {
            console.log(error)
        }
    }

    function goToGroupPage(id: number) {
        router.push(`/Group/${id}`)
    }

    async function getGroups() {
        const response = await fetch('/api/groups')
        const data = await response.json()
        console.log("Get all groups", data.groups)
        return data.groups || [];
    }

    function init() {
        getGroupsUsers().then((groupUsers) => {
            const userGroupIds = groupUsers.filter((groupUser: GroupUsers) => groupUser.IdU === session?.user?.email).map((groupUser: GroupUsers) => groupUser.IdG);
            getGroups().then((groups) => {
                const filteredGroups = groups.filter((group: Group) => userGroupIds.includes(group.id));
                setGroups(filteredGroups);
            });
        });

        if (!session) {
            router.push('/')
        }
    }

    async function getGroupsUsers() {
        const response = await fetch('/api/groups/users')
        const data = await response.json()
        console.log("Group User intermediate : ", data.groupsUser)
        return data.groupsUser || [];
    }

    async function postGroupUser(IdG: number, IdU: string) {
        const response = await fetch('/api/groups/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                IdG,
                IdU,
            }),
        })
        const data = await response.json()
        console.log("data.groupUser", data.groupUser)

        return data.groupUser || [];
    }

    useEffect(() => {
        init()
    }, []);


    return (
        <Layout>
            <center>
                <h1 className="titre" > Groups </h1> <br />
                <div className="cardGrid" >
                    {groups.map((group: Group) => (
                        <div key={group.id} className="card" onClick={() => goToGroupPage(group.id)} >
                            <img src={group.image} alt="" />
                            <div>
                                <h3>{group.name}</h3>
                                <p>{group.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <br /> <br /> <hr /> <br /> <br />
                <h1>  New group ? </h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" placeholder="Group name" />
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" placeholder="Group description" />
                    <label htmlFor="image">Image</label>
                    <input type="text" name="image" id="image" placeholder="Link image" /> <br />
                    <button type="submit" > Create groupe </button>
                </form> <br /> <br />
            </center>
        </Layout>
    )
}