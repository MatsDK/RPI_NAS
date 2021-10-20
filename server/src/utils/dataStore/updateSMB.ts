import { Datastore } from "../../entity/Datastore"
import { User } from "../../entity/User"
import { Any } from "typeorm"
import { exec } from "../exec"
import fsPath from "path"
import fs from "fs-extra"
import { Node } from "../../entity/CloudNode"

const baseConf = [
    "comment = Smb",
    "read only = no",
    "browsable = yes",
    "writable = yes",
    "public = yes",
    "guest ok  = yes",
    "create mask = 0644",
    "directory mask = 0755",
]

export const updateSMB = async ({ loginName }: Node) => {
	return new Promise(async (res, rej) => {
		try {
			const SMBDatastores = await Datastore.find({ where: { smbEnabled: true } }),
			       baseConfPath = fsPath.join(__dirname, "../../../assets/base_smb.conf")
			
			let file = (fs.readFileSync(baseConfPath).toString().split("\n"))

			for (const datastore of SMBDatastores) {
				const newLines: string[] = [`[${datastore.name}]`, ...baseConf]

				newLines.push(`force user = ${loginName}`)
				newLines.push(`path = ${datastore.basePath}`)

				file = [...file, ...newLines]
			}


			fs.writeFileSync(`/etc/samba/smb.conf`, file.join("\n"))

			const {err: SMBServiceErr} = await restartSMBService()
			if(SMBServiceErr) return rej({err:SMBServiceErr}) 
			

			const {err: UpdateFirewallErr} = await updateFirewall()
			if(UpdateFirewallErr) return rej({err: UpdateFirewallErr})

			res({err: false})
		} catch (err) {
			rej({err})
		}
	})

}	

type returnType = { err: string | boolean}

const restartSMBService = async (): Promise<returnType> => {
	const { stderr } = await exec(`service smbd restart`)

	return { err: !!stderr ? stderr : false }
}

const updateFirewall = async (): Promise<returnType> => {
	const { stderr } = await exec(`ufw allow samba`)

	return { err: !!stderr ? stderr : false }
}
