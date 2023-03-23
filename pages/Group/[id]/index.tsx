import { useState, useEffect } from "react"
import Layout from "../../../components/layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
// @ts-ignore
import { Group, Reminder, User, GroupUsers } from "@/interfaces"


export default function ActualGroup() {
    const { data: session } = useSession()
    const router = useRouter();
    const { id } = router.query;
    const [currentGroup, setCurrentGroup] = useState<Group>({})
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [groupUsers, setGroupUsers] = useState([])
    const [users, setUsers] = useState([])
    const [colors, setColors] = useState(['cyan', 'pink', 'orange', 'blue'])
    const [nbMembers, setNbMembers] = useState(0)
    const [groupModified, setGroupModified] = useState<Group>({})
    const [sessionUser, setSessionUser] = useState<User>(session?.user)
    const isValidId = !isNaN(parseInt(id as string));


    async function postReminderSubmit(e: any) {
        e.preventDefault()
        const { titre, description, daterendu, couleur } = e.target.elements
        console.log(titre.value, description.value, daterendu.value, couleur.value);

        const newReminder: Reminder = {
            title: titre.value,
            description: description.value,
            dateRendu: daterendu.value,
            couleur: couleur.value,
            groupId: id
        }

        postReminder(newReminder);
    }

    async function getUsers() {
        const response = await fetch('/api/users')
        const data = await response.json()
        console.log(data.users)
        return data.users || [];
    }

    async function getInfosOfThisGroup() {
        const response = await fetch(`/api/groups/${id}`)
        const data = await response.json()
        console.log("response", data.group)
        return data.group || [];
    }


    async function getReminders() {
        const response = await fetch(`/api/reminders`)
        const tmp = await response.json()
        const data = tmp.reminders.filter((reminder: Reminder) => reminder.groupId == id)
        data.forEach((reminder: Reminder) => {
            const date = new Date(reminder.dateRendu)
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            reminder.dateRendu = `${day}/${month}/${year}`
        })
        return data || [];
    }

    async function getGroupsUsers() {
        const response = await fetch('/api/groups/users')
        const data = await response.json()
        console.log("Group User intermediate : ", data.groupsUser)
        return data.groupsUser || [];
    }

    async function postReminder(reminder: Reminder) {
        const response = await fetch('/api/reminders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reminder),
        })
        const data = await response.json()
        console.log("data.reminder", data.reminder)
        document.querySelector("form")?.reset();
        getReminders().then((reminders) => {
            setReminders(reminders)
        })
        return data.groupUser || [];
    }

    function toPageReminder(id: number) {
        router.push(`/Reminder/${id}`)
    }

    function userIsInGroup(email: number, groupId: number) {
        const groupUser = groupUsers.find((groupUser: any) => groupUser.IdU == email && groupUser.IdG == groupId)
        return groupUser ? true : false
    }

    async function addingUser(email: string, groupId: number) {
        const user: User = users.find((user: User) => user.email == email)
        if (user) {
            const groupUser: GroupUsers = {
                IdU: user.email,
                IdG: groupId
            }
            const response = await fetch('/api/groups/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupUser),
            })
            const data = await response.json()
            console.log("data.groupUser", data.groupUser)
            getGroupsUsers().then((groupsUsers) => {
                setGroupUsers(groupsUsers)
            })
            return data.groupUser || [];
        }
    }

    function init() {
        getInfosOfThisGroup().then((group) => {
            setCurrentGroup(group)
            setGroupModified(group)
        })
        getReminders().then((reminders) => {
            setReminders(reminders)
        })
        getUsers().then((users: User) => {
            setUsers(users)
        })
        getGroupsUsers().then((groupsUsers) => {
            setGroupUsers(groupsUsers)
        })
        if (!session) {
            router.push('/')
        }
    }

    function memberNumber() {
        let nb = 0;
        groupUsers.forEach((groupUser: GroupUsers) => {
            if (groupUser.IdG == id) {
                nb++;
            }
        })
        setNbMembers(nb);
    }


    async function modifyGroup(e: any) {
        e.preventDefault()
        const { newName, newDescription, newImage } = e.target.elements
        const newGroup: Group = {
            name: newName.value,
            description: newDescription.value,
            image: newImage.value,
            id: id
        }
        const response = await fetch(`/api/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGroup),
        })
        const data = await response.json()
        console.log("data.group", data.group)
        getInfosOfThisGroup().then((group) => {
            setCurrentGroup(group)
        })
        return data.group || [];
    }


    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        memberNumber();
    }, [groupUsers])



    // If session exists, display content
    return (
        <Layout>
            <div>
                {isValidId ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
                                <h1 style={{ fontSize: '3em', color: 'var(--main-color)' }} >
                                    {currentGroup.name}
                                </h1>
                                <p style={{ fontStyle: 'italic' }} >
                                    {currentGroup.description}
                                </p>
                            </div>
                            <div style={{ width: '200px', height: '200px', marginLeft: '30px' }}>
                                <img src={currentGroup.image} style={{ maxWidth: '110%', maxHeight: '110%', objectFit: 'cover' }} />
                            </div>
                        </div> <br /> <br /> <br />
                        <center>
                            <h1 className="titre" >  New Reminder </h1>
                            <form onSubmit={postReminderSubmit} >
                                <label htmlFor="daterendu">Date</label>
                                <input type="date" name="daterendu" id="daterendu" />
                                <label htmlFor="name">Name</label>
                                <input type="text" name="titre" id="titre" placeholder="Reminder title" />
                                <label htmlFor="description"> Description </label>
                                <input type="text" name="description" id="description" placeholder="Reminder description" />
                                <label htmlFor="couleur"> Color </label>
                                <select name="couleur" id="couleur">
                                    <option value="1"> Cyan </option>
                                    <option value="2"> Pink </option>
                                    <option value="3"> Orange  </option>
                                    <option value="4"> Blue </option>
                                </select>
                                <button type="submit" > Create Reminder </button>
                            </form></center> <br /> <br /> <br />
                        <center><h1 className="titre" > Reminders </h1></center>
                        <div className="cardGrid" >
                            {reminders.length > 0 ?
                                reminders.map((reminder: Reminder) => (
                                    <div key={reminder.id} className="card" onClick={() => toPageReminder(reminder.id)}
                                        style={{ borderTop: `10px solid ${colors[parseInt(reminder.couleur) - 1]}` }} >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingRight: '15px'
                                        }}
                                        >
                                            <h3>{reminder.title} </h3>
                                        </div>
                                        <p> {reminder.dateRendu} </p>
                                        <p>{reminder.description}</p>
                                    </div>
                                ))
                                :
                                <p> You have no reminder </p>
                            }
                        </div> <br /> <br /> <br />
                        <center><h1 className="titre" >  Add members </h1></center>
                        <div  >
                            {users.map((user: User) => (
                                <div key={user.id} >
                                    <div className="UserItem" >
                                        <h3>{user.name}</h3>
                                        <p>{user.email}</p>

                                        {userIsInGroup(user.email, currentGroup.id) ? (
                                            <p> Added </p>
                                        ) : (
                                            <button type="button" onClick={() => addingUser(user.email, currentGroup.id)} >
                                                Add to group
                                            </button>
                                        )}
                                    </div> <br />
                                </div>
                            ))}
                        </div> <br /> <br /> <br />
                        <center><h1 className="titre" >  Modify group </h1>
                            <form onSubmit={modifyGroup}>
                                <label htmlFor="newName">Name</label>
                                <input
                                    type="text"
                                    name="newName"
                                    id="newName"
                                    value={groupModified?.name || ''}
                                    onChange={(e) => setGroupModified({ ...groupModified, name: e.target.value })}
                                    placeholder="Nom du groupe"
                                />
                                <label htmlFor="newDescription">Description</label>
                                <input
                                    type="text"
                                    name="newDescription"
                                    id="newDescription"
                                    value={groupModified?.description || ''}
                                    onChange={(e) => setGroupModified({ ...groupModified, description: e.target.value })}
                                    placeholder="Description du groupe"
                                />
                                <label htmlFor="newImage">Image</label>
                                <input
                                    type="text"
                                    name="newImage"
                                    id="newImage"
                                    value={groupModified?.image || ''}
                                    onChange={(e) => setGroupModified({ ...groupModified, image: e.target.value })}
                                    placeholder="Image du groupe"
                                /> <br />
                                <button type="submit" > Modify group </button>
                            </form> <br /> <br />
                        </center>
                    </>
                ) : (
                    <>
                        <Link href="/" >
                            <button type="button" > Back to home </button>
                        </Link>
                    </>
                )}
            </div>
        </Layout>
    )

}