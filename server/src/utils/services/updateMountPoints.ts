import fsPath from "path"
import fs from "fs-extra"
import { Datastore , DataStoreStatus } from "../../entity/Datastore"
import { Node } from "../../entity/CloudNode"
import { User } from "../../entity/User"
import { exec } from "../exec"
import { dfOptions } from "../../constants"
const df = require("node-df")

interface updateMountPointsProps {
	datastore: Datastore
	host: Node
	user: User
}

export const updateMountPoints = async ({ datastore, host, user }: updateMountPointsProps, serviceName: string) => {
	  datastore.status = DataStoreStatus.INIT

	  switch(serviceName) {
		  case "SMB": {
			  try {

			  datastore.smbEnabled = !datastore.smbEnabled
			  await datastore.save()

			 const mountPoint = fsPath.join(`/home/`, user.osUserName, datastore.name)
			 

			 if(datastore.smbEnabled) {
				 const fileSystemLoc = await getFileSystemLocation(datastore.basePath)
				 if(!fileSystemLoc) return false

				fs.mkdirSync(mountPoint)

				const { stderr: mountErr } = await exec(`mount ${fileSystemLoc} ${mountPoint}`)
				if(mountErr) {
					console.log(mountErr)
					return false
				}

			} else {
				const { stderr: umountErr } = await exec(`umount ${mountPoint}`)
				if(umountErr) {
					console.log(umountErr)
					return false
				}

				fs.removeSync(mountPoint)
			}

			datastore.status = DataStoreStatus.ONLINE
			await datastore.save()
			  } catch(e) {
				  console.log(e)
				  return false
			  }
		  
			break
		  }
		  case "FTP": {
			  
			  break
		  } 
	  }

	  return true

}

const getFileSystemLocation = async (path: string): Promise<string | undefined> => 
	new Promise((resolve, rej) => {
		df({ ...dfOptions, file: "-a" }, (err: any, res: any) => {
			if(err) rej(err)

			resolve(res.filter((fs: any) => fs.mount === path)[0]?.filesystem)
				 
		})
	})

