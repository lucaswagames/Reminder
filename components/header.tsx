import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// @ts-ignore
import Head from "next/head"

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const router = useRouter()


  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>

      <nav>
        <ul className={styles.navItems}>
          <div className={styles.navFlex} >
            <div>
              <li className={styles.navItem}>
                <Link href="/"> Home </Link>
              </li>
              {session && (
                <li className={styles.navItem}>
                  <Link href="/Group"> Groups </Link>
                </li>
              )}
            </div>
            {session ? (
              <div>
                <Link href="/MyAccount">
                  <button type="button" style={{ marginRight: '20px' }} >
                    <p>My Account</p>
                  </button>
                </Link>

                <Link href="/api/auth/signout" onClick={(e) => {
                  e.preventDefault()
                  router.push('/')
                  signOut()
                }}>
                  <button>
                    <p>Sign out</p>
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/api/auth/signin" onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }} >
                  <button>
                    <p>Sign in</p>
                  </button>
                </Link>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  )
}
