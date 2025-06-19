import { useState } from "react"

export const useMouseOver = () => {
	const [show, setShow] = useState<boolean>(false)
	return {
		ref: (x: HTMLElement | null) => {
			if (!x) return
			x.onmouseover = () => {
				setShow(true)
			}
			x.onmouseleave = () => {
				setShow(false)
			}
		},
		show,
	}
}
