import React, { useEffect, useRef, useState } from "react"
import "./App.css"
import mouseimg from "./mouse.png"
import useInterval from "./useInterval"

const canvasX = 1000
const canvasY = 1000
const initialSnake = [ [ 4, 10 ], [ 4, 10 ] ]
const initialMouse = [ 14, 10 ]
const scale = 50
const timeDelay = 100

function App() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [ snake, setSnake ] = useState(initialSnake)
	const [ mouse, setMouse ] = useState(initialMouse)
	const [ direction, setDirection ] = useState([ 0, -1 ])
	const [ delay, setDelay ] = useState<number | null>(null)
	const [ gameOver, setGameOver ] = useState(false)
	const [ score, setScore ] = useState(0)

	useInterval(() => runGame(), delay)

	useEffect(
		() => {
			let food = document.getElementById("mouseimg") as HTMLCanvasElement
			if (canvasRef.current) {
				const canvas = canvasRef.current
				const ctx = canvas.getContext("2d")
				if (ctx) {
					ctx.setTransform(scale, 0, 0, scale, 0, 0)
					ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
					ctx.fillStyle = "#01d024"
					snake.forEach(([ x, y ]) => ctx.fillRect(x, y, 1, 1))
					ctx.drawImage(food, mouse[0], mouse[1], 1, 1)
				}
			}
		},
		[ snake, mouse, gameOver ]
	)

	function handleSetScore() {
		if (score > Number(localStorage.getItem("snakeScore"))) {
			localStorage.setItem("snakeScore", JSON.stringify(score))
		}
	}

	function play() {
		setSnake(initialSnake)
		setMouse(initialMouse)
		setDirection([ 1, 0 ])
		setDelay(timeDelay)
		setScore(0)
		setGameOver(false)
	}

	function checkCollision(head: number[]) {
		for (let i = 0; i < head.length; i++) {
			if (head[i] < 0 || head[i] * scale >= canvasX) return true
		}
		for (const s of snake) {
			if (head[0] === s[0] && head[1] === s[1]) return true
		}
		return false
	}

	function appleAte(newSnake: number[][]) {
		let coord = mouse.map(() => Math.floor(Math.random() * canvasX / scale))
		if (newSnake[0][0] === mouse[0] && newSnake[0][1] === mouse[1]) {
			let newApple = coord
			setScore(score + 1)
			setMouse(newApple)
			return true
		}
		return false
	}

	function runGame() {
		const newSnake = [ ...snake ]
		const newSnakeHead = [ newSnake[0][0] + direction[0], newSnake[0][1] + direction[1] ]
		newSnake.unshift(newSnakeHead)
		if (checkCollision(newSnakeHead)) {
			setDelay(null)
			setGameOver(true)
			handleSetScore()
		}
		if (!appleAte(newSnake)) {
			newSnake.pop()
		}
		setSnake(newSnake)
	}

	function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
		switch (e.key) {
			case "ArrowLeft":
				setDirection([ -1, 0 ])
				break
			case "ArrowUp":
				setDirection([ 0, -1 ])
				break
			case "ArrowRight":
				setDirection([ 1, 0 ])
				break
			case "ArrowDown":
				setDirection([ 0, 1 ])
				break
		}
	}

	return (
		<div onKeyDown={(e) => changeDirection(e)}>
			<img id="mouseimg" src={mouseimg} alt="mouse" width="30" />
			<canvas className="playArea" ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`} />
			{gameOver && <div className="gameOver">Game Over</div>}
			<button onClick={play} className="playButton">
				Play
			</button>
			<div className="scoreBox">
				<h2>Score: {score}</h2>
				<h2>High Score: {localStorage.getItem("snakeScore")}</h2>
			</div>
		</div>
	)
}

export default App