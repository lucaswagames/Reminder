import { useState, useEffect } from "react"
import Layout from "../../../components/layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
// @ts-ignore
import { Reminder } from "@/interfaces"

export default function ActuelReminder() {
    const { data: session } = useSession()
    const router = useRouter();
    const { id } = router.query;
    const [currentReminder, setCurrentReminder] = useState<Reminder>({})
    const [newReminder, setNewReminder] = useState<Reminder>({})
    const [colors, setColors] = useState(['cyan', 'pink', 'orange', 'blue'])
    const [dateFormatInput, setDateFormatInput] = useState("");


    async function getReminderInformations() {
        const response = await fetch(`/api/reminders/${id}`)
        const data = await response.json()
        // On modifie la date pour qu'elle soit plus lisible
        const date = new Date(data.reminder.dateRendu)
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const dateRendu = day + "/" + month + "/" + year
        data.reminder.dateRendu = dateRendu
        console.log("Reminder informations : ", data.reminder)
        return data.reminder || [];
    }

    function init() {
        getReminderInformations().then((reminder) => {
            setCurrentReminder(reminder);
            setNewReminder(reminder);

            // Format the date for input
            const dateParts = reminder.dateRendu.split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;

            console.log("Formatted date : ", formattedDate)
            setDateFormatInput(formattedDate);
        });
        if (!session) {
            router.push('/')
        }
    }


    async function toModifiatereminder(e: any) {
        e.preventDefault()
        const { newTitle, newDescription, newDateRendu, newCouleur } = e.target.elements
        const newReminder: Reminder = {
            title: newTitle.value,
            description: newDescription.value,
            dateRendu: newDateRendu.value,
            couleur: newCouleur.value,
            groupId: currentReminder.groupId,
            id: currentReminder.id
        }
        console.log("New reminder : ", newReminder)
        const response = await fetch(`/api/reminders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReminder)
        })
        const data = await response.json()
        console.log("Data : ", data)
        getReminderInformations().then((reminder) => {
            setCurrentReminder(reminder);
            // Format the date for input
            const dateParts = reminder.dateRendu.split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
            console.log("Formatted date : ", formattedDate)
            setDateFormatInput(formattedDate);
        });
    }

    // Delete a reminder
    async function supprReminder(e: any) {
        e.preventDefault()
        const response = await fetch(`/api/reminders/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
        const data = await response.json()
        router.push(`/Group`)
    }


    useEffect(() => {
        init();
    }, []);


    return (
        <Layout>
            <center>
                <div style={{ background: '#e6e6e6', padding: '10px', borderRadius: '5px', width: '56%' }} >
                    <h1 > {currentReminder.title} </h1>
                    <p style={{ fontSize: '20px' }} > <i> {currentReminder.description} </i> </p>
                    <p> {currentReminder.dateRendu} </p>
                    <button type="button" onClick={supprReminder} > DELETE </button>
                </div> <br /> <br /><br /> <br />
            </center>
            <h1>  Modify reminder </h1>
            <form onSubmit={toModifiatereminder}>
                <label htmlFor="newTitle">Title</label>
                <input
                    type="text"
                    name="newTitle"
                    id="newTitle"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="Titre du reminder"
                />
                <label htmlFor="newDescription">Description</label>
                <input
                    type="text"
                    name="newDescription"
                    id="newDescription"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    placeholder="Description du reminder"
                />
                <label htmlFor="newDateRendu"> Reminder date </label>
                <input
                    type="date"
                    name="newDateRendu"
                    id="newDateRendu"
                    value={dateFormatInput}
                    onChange={(e) => setNewReminder({ ...newReminder, dateRendu: e.target.value })}
                    onInput={(e: React.FormEvent<HTMLInputElement>) => setDateFormatInput(e.currentTarget.value)}
                    placeholder="Date de rendu du reminder"
                />
                <label htmlFor="newCouleur"> Color </label>
                <select name="newCouleur" id="newCouleur"
                    value={newReminder.couleur}
                    onChange={(e) => setNewReminder({ ...newReminder, couleur: e.target.value })}
                >
                    <option value="1"> Cyan </option>
                    <option value="2"> Pink </option>
                    <option value="3"> Orange  </option>
                    <option value="4"> Blue </option>
                </select>
                <button type="submit" > Modify group </button>
            </form> <br /> <br />
        </Layout>
    )

}