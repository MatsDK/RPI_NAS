const raceTimeout = (timeout: number) => new Promise((res, _rej) => {
	setTimeout(res, timeout, { err: "connection timed out" })
})

export const withTimeout = (fn: Promise<any>, timeout: number, timeoutCb: (r: any) => void = () => { }): Promise<any> => new Promise((res, rej) => {
	Promise.race([raceTimeout(timeout), fn]).then((r) => {
		if (r.err) {
			timeoutCb(r.err)
			res(null)
		}

		res(r)
	})
})
