import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'

async function getUser() {
	const session = await getServerSession(authOptions)
	return session
}

export default getUser
