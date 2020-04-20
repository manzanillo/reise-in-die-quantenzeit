
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.Circuit.Editor = function( circuit, targetEl ){


	//  First order of business,
	//  we require a valid circuit.

	if( circuit instanceof Q.Circuit !== true ) return
	this.circuit = circuit
	this.index = Q.Circuit.Editor.index ++


	//  Q.Circuit.Editor is all about the DOM
	//  so we’re going to get som use out of this
	//  stupid (but convenient) shorthand here.

	const createDiv = function(){

		return document.createElement( 'div' )
	}


	//  ++++++++++++++++++
	//  The nature of the domId needs to be better thought out!
	//  Check for name collisions beforehand???
	//  What’s the contingency??

	const
	name  = typeof circuit.name === 'string' ? circuit.name : 'Q-editor-'+ this.index,
	domId = name.replace( /^[^a-z]+|[^\w:.-]+/gi, '' )
	
	this.name  = name
	this.domId = domId



	//  If we’ve been passed a target DOM element
	//  we should use that as our circuit element.

	if( typeof targetEl === 'string' ) targetEl = document.getElementById( targetEl )	
	const circuitEl = targetEl instanceof HTMLElement ? targetEl : createDiv()
	circuitEl.classList.add( 'Q-circuit' )
	circuitEl.setAttribute( 'id', this.domId )


	//  We want a way to easily get to the circuit 
	//  from this interface’s DOM element.
	// (But we don’t need a way to reference this DOM element
	//  from the circuit. A circuit can have many DOM elements!)
	//  And we also want an easy way to reference this DOM element
	//  from this Editor instance.

	circuitEl.circuit = circuit
	this.domElement = circuitEl


	//  Toolbar.

	const toolbarEl = createDiv()
	circuitEl.appendChild( toolbarEl )
	toolbarEl.classList.add( 'Q-circuit-toolbar' )

	//  Add a toggle switch for locking the circuit.

	const lockToggle = createDiv()
	toolbarEl.appendChild( lockToggle )
	lockToggle.classList.add( 'Q-circuit-button', 'Q-circuit-toggle', 'Q-circuit-toggle-lock' )
	lockToggle.setAttribute( 'title', 'Lock / unlock' )
	lockToggle.innerText = '🔓'

	const undoButton = createDiv()
	toolbarEl.appendChild( undoButton )
	undoButton.classList.add( 'Q-circuit-button', 'Q-circuit-button-undo' )
	undoButton.setAttribute( 'title', 'Undo' )
	undoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	undoButton.innerHTML = '&larr;'
	window.addEventListener( 'Q.History undo is depleted', function( event ){

		if( event.detail.instance === circuit )
			undoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	})
	window.addEventListener( 'Q.History undo is capable', function( event ){

		if( event.detail.instance === circuit )
			undoButton.removeAttribute( 'Q-disabled' )
	})

	const redoButton = createDiv()
	toolbarEl.appendChild( redoButton )
	redoButton.classList.add( 'Q-circuit-button', 'Q-circuit-button-redo' )
	redoButton.setAttribute( 'title', 'Redo' )
	redoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	redoButton.innerHTML = '&rarr;'
	window.addEventListener( 'Q.History redo is depleted', function( event ){

		if( event.detail.instance === circuit )
			redoButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	})
	window.addEventListener( 'Q.History redo is capable', function( event ){

		if( event.detail.instance === circuit )
			redoButton.removeAttribute( 'Q-disabled' )
	})


	const controlButton = createDiv()
	toolbarEl.appendChild( controlButton )
	controlButton.classList.add( 'Q-circuit-button', 'Q-circuit-toggle', 'Q-circuit-toggle-control' )
	controlButton.setAttribute( 'title', 'Create controlled operation' )
	controlButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	controlButton.innerText = 'C'

	const swapButton = createDiv()
	toolbarEl.appendChild( swapButton )
	swapButton.classList.add( 'Q-circuit-button', 'Q-circuit-toggle-swap' )
	swapButton.setAttribute( 'title', 'Create swap operation' )
	swapButton.setAttribute( 'Q-disabled', 'Q-disabled' )
	swapButton.innerText = 'S'


	//  Create a circuit board container
	//  so we can house a scrollable circuit board.

	const boardContainerEl = createDiv()
	circuitEl.appendChild( boardContainerEl )
	boardContainerEl.classList.add( 'Q-circuit-board-container' )
	//boardContainerEl.addEventListener( 'touchstart', Q.Circuit.Editor.onPointerPress )
	boardContainerEl.addEventListener( 'mouseleave', function(){

		Q.Circuit.Editor.unhighlightAll( circuitEl )
	})

	const boardEl = createDiv()
	boardContainerEl.appendChild( boardEl )
	boardEl.classList.add( 'Q-circuit-board' )

	const backgroundEl = createDiv()
	boardEl.appendChild( backgroundEl )
	backgroundEl.classList.add( 'Q-circuit-board-background' )


	//  Create background highlight bars 
	//  for each row.

	for( let i = 0; i < circuit.bandwidth; i ++ ){

		const rowEl = createDiv()
		backgroundEl.appendChild( rowEl )
		rowEl.style.position = 'relative'
		rowEl.style.gridRowStart = i + 2
		rowEl.style.gridColumnStart = 1
		rowEl.style.gridColumnEnd = Q.Circuit.Editor.momentIndexToGridColumn( circuit.timewidth ) + 1
		rowEl.setAttribute( 'register-index', i + 1 )

		const wireEl = createDiv()
		rowEl.appendChild( wireEl )
		wireEl.classList.add( 'Q-circuit-register-wire' )
	}


	//  Create background highlight bars 
	//  for each column.

	for( let i = 0; i < circuit.timewidth; i ++ ){

		const columnEl = createDiv()
		backgroundEl.appendChild( columnEl )
		columnEl.style.gridRowStart = 2
		columnEl.style.gridRowEnd = Q.Circuit.Editor.registerIndexToGridRow( circuit.bandwidth ) + 1
		columnEl.style.gridColumnStart = i + 3
		columnEl.setAttribute( 'moment-index', i + 1 )
	}


	//  Create the circuit board foreground
	//  for all interactive elements.

	const foregroundEl = createDiv()
	boardEl.appendChild( foregroundEl )
	foregroundEl.classList.add( 'Q-circuit-board-foreground' )


	//  Add “Select All” toggle button to upper-left corner.

	const selectallEl = createDiv()
	foregroundEl.appendChild( selectallEl )
	selectallEl.classList.add( 'Q-circuit-header', 'Q-circuit-selectall' )	
	selectallEl.setAttribute( 'title', 'Select all' )
	selectallEl.setAttribute( 'moment-index', '0' )
	selectallEl.setAttribute( 'register-index', '0' )
	selectallEl.innerHTML = '&searr;'


	//  Add register index labels to left-hand column.
	
	for( let i = 0; i < circuit.bandwidth; i ++ ){

		const 
		registerIndex = i + 1,
		registerLabelEl = createDiv()
		
		foregroundEl.appendChild( registerLabelEl )
		registerLabelEl.classList.add( 'Q-circuit-header', 'Q-circuit-register-label' )
		registerLabelEl.setAttribute( 'title', 'Register '+ registerIndex +' of '+ circuit.bandwidth )
		registerLabelEl.setAttribute( 'register-index', registerIndex )
		registerLabelEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )
		registerLabelEl.innerText = registerIndex
	}


	//  Add “Add register” button.
	
	const addRegisterEl = createDiv()
	foregroundEl.appendChild( addRegisterEl )
	addRegisterEl.classList.add( 'Q-circuit-header', 'Q-circuit-register-add' )
	addRegisterEl.setAttribute( 'title', 'Add register' )
	addRegisterEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( circuit.bandwidth + 1 )
	addRegisterEl.innerText = '+'


	//  Add moment index labels to top row.

	for( let i = 0; i < circuit.timewidth; i ++ ){

		const 
		momentIndex = i + 1,
		momentLabelEl = createDiv()

		foregroundEl.appendChild( momentLabelEl )
		momentLabelEl.classList.add( 'Q-circuit-header', 'Q-circuit-moment-label' )
		momentLabelEl.setAttribute( 'title', 'Moment '+ momentIndex +' of '+ circuit.timewidth )
		momentLabelEl.setAttribute( 'moment-index', momentIndex )
		momentLabelEl.style.gridColumnStart = Q.Circuit.Editor.momentIndexToGridColumn( momentIndex )
		momentLabelEl.innerText = momentIndex
	}


	//  Add “Add moment” button.
	
	const addMomentEl = createDiv()
	foregroundEl.appendChild( addMomentEl )
	addMomentEl.classList.add( 'Q-circuit-header', 'Q-circuit-moment-add' )
	addMomentEl.setAttribute( 'title', 'Add moment' )
	addMomentEl.style.gridColumnStart = Q.Circuit.Editor.momentIndexToGridColumn( circuit.timewidth + 1 )
	addMomentEl.innerText = '+'


	//  Add input values.

	circuit.qubits.forEach( function( qubit, i ){

		const 
		rowIndex = i + 1,
		inputEl = createDiv()
		
		inputEl.classList.add( 'Q-circuit-header', 'Q-circuit-input' )
		inputEl.setAttribute( 'title', `Qubit #${ rowIndex } starting value` )
		inputEl.setAttribute( 'register-index', rowIndex )
		inputEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( rowIndex )
		inputEl.innerText = qubit.beta.toText()
		foregroundEl.appendChild( inputEl )
	})


	//  Add operations.

	circuit.operations.forEach( function( operation ){

		Q.Circuit.Editor.set( circuitEl, operation )
	})


	//  Add event listeners.

	circuitEl.addEventListener( 'mousedown',  Q.Circuit.Editor.onPointerPress )
	circuitEl.addEventListener( 'touchstart', Q.Circuit.Editor.onPointerPress )
	window.addEventListener( 
	
		'Q.Circuit.set$', 
		 Q.Circuit.Editor.prototype.onExternalSet.bind( this )
	)
	window.addEventListener(

		'Q.Circuit.clear$',
		Q.Circuit.Editor.prototype.onExternalClear.bind( this )
	)


	//  How can we interact with this circuit
	//  through code? (How cool is this?!)

	const referenceEl = document.createElement( 'p' )
	circuitEl.appendChild( referenceEl )
	referenceEl.innerHTML = `
		This circuit is accessible in your 
		<a href="index.html#Open_your_JavaScript_console" target="_blank">JavaScript console</a>
		as <code>$('#${ domId }').circuit</code>`


	//  Put a note in the JavaScript console
	//  that includes how to reference the circuit via code
	//  and an ASCII diagram for reference.

	Q.log( 0.5,
		
		`\n\nCreated a DOM interface for $('#${ domId }').circuit\n\n`,
		 circuit.toDiagram(),
		'\n\n\n'
	)
}


//  Augment Q.Circuit to have this functionality.

Q.Circuit.toDom = function( circuit, targetEl ){

	return new Q.Circuit.Editor( circuit, targetEl ).domElement
}
Q.Circuit.prototype.toDom = function( targetEl ){

	return new Q.Circuit.Editor( this, targetEl ).domElement
}








Object.assign( Q.Circuit.Editor, {

	index: 0,
	help: function(){ return Q.help( this )},
	dragEl: null,
	gridColumnToMomentIndex: function( gridColumn  ){ return +gridColumn - 2 },
	momentIndexToGridColumn: function( momentIndex ){ return momentIndex + 2 },
	gridRowToRegisterIndex:  function( gridRow ){ return +gridRow - 1 },
	registerIndexToGridRow:  function( registerIndex ){ return registerIndex + 1 },
	gridSize: 4,//  CSS: grid-auto-columns = grid-auto-rows = 4rem.
	pointToGrid: function( p ){

		
		//  Take a 1-dimensional point value
		// (so either an X or a Y but not both)
		//  and return what CSS grid cell contains it
		//  based on our 4rem × 4rem grid setup.
		
		const rem = parseFloat( getComputedStyle( document.documentElement ).fontSize )
		return 1 + Math.floor( p / ( rem * Q.Circuit.Editor.gridSize ))
	},
	gridToPoint: function( g ){


		//  Take a 1-dimensional grid cell value
		// (so either a row or a column but not both)
		//  and return the minimum point value it contains.

		const  rem = parseFloat( getComputedStyle( document.documentElement ).fontSize )
		return rem * Q.Circuit.Editor.gridSize * ( g - 1 )
	},
	getInteractionCoordinates: function( event, pageOrClient ){

		if( typeof pageOrClient !== 'string' ) pageOrClient = 'client'//page
		if( event.changedTouches && 
			event.changedTouches.length ) return {

			x: event.changedTouches[ 0 ][ pageOrClient +'X' ],
			y: event.changedTouches[ 0 ][ pageOrClient +'Y' ]
		}
		return {

			x: event[ pageOrClient +'X' ],
			y: event[ pageOrClient +'Y' ]
		}
	},
	createPalette: function( targetEl ){

		if( typeof targetEl === 'string' ) targetEl = document.getElementById( targetEl )	

		const 
		paletteEl = targetEl instanceof HTMLElement ? targetEl : document.createElement( 'div' ),
		randomRangeAndSign = function(  min, max ){

			const r = min + Math.random() * ( max - min )
			return Math.floor( Math.random() * 2 ) ? r : -r
		}

		paletteEl.classList.add( 'Q-circuit-palette' )

		'HXYZST!'
		.split( '' )
		.forEach( function( label ){

			const gate = Q.Gate.findByLabel( label )

			const operationEl = document.createElement( 'div' )
			paletteEl.appendChild( operationEl )
			operationEl.classList.add( 'Q-circuit-operation' )
			operationEl.classList.add( 'Q-circuit-operation-'+ gate.css )
			operationEl.setAttribute( 'gate-label', label )
			operationEl.setAttribute( 'title', gate.name )

			const tileEl = document.createElement( 'div' )
			operationEl.appendChild( tileEl )
			tileEl.classList.add( 'Q-circuit-operation-tile' )
			if( label !== '!' ) tileEl.innerText = label

			;[ 'before', 'after' ].forEach( function( layer ){

				tileEl.style.setProperty( '--Q-'+ layer +'-rotation', randomRangeAndSign( 0.5, 4 ) +'deg' )
				tileEl.style.setProperty( '--Q-'+ layer +'-x', randomRangeAndSign( 1, 4 ) +'px' )
				tileEl.style.setProperty( '--Q-'+ layer +'-y', randomRangeAndSign( 1, 3 ) +'px' )
			})
		})

		paletteEl.addEventListener( 'mousedown',  Q.Circuit.Editor.onPointerPress )
		paletteEl.addEventListener( 'touchstart', Q.Circuit.Editor.onPointerPress )
		return paletteEl
	}
})






    /////////////////////////
   //                     //
  //   Operation CLEAR   //
 //                     //
/////////////////////////


Q.Circuit.Editor.prototype.onExternalClear = function( event ){

	if( event.detail.circuit === this.circuit ){

		Q.Circuit.Editor.clear( this.domElement, {

			momentIndex: event.detail.momentIndex,
			registerIndices: event.detail.registerIndices
		})
	}
}
Q.Circuit.Editor.clear = function( circuitEl, operation ){

	const momentIndex = operation.momentIndex
	operation.registerIndices.forEach( function( registerIndex ){

		Array
		.from( circuitEl.querySelectorAll(

			`[moment-index="${ momentIndex }"]`+
			`[register-index="${ registerIndex }"]`
		
		))
		.forEach( function( op ){

			op.parentNode.removeChild( op )
		})
	})
}






    ///////////////////////
   //                   //
  //   Operation SET   //
 //                   //
///////////////////////


Q.Circuit.Editor.prototype.onExternalSet = function( event ){

	if( event.detail.circuit === this.circuit ){

		Q.Circuit.Editor.set( this.domElement, {

			gate: event.detail.gate,
			momentIndex: event.detail.momentIndex,
			registerIndices: event.detail.registerIndices
		})
	}
}
Q.Circuit.Editor.set = function( circuitEl, operation ){

	const
	backgroundEl = circuitEl.querySelector( '.Q-circuit-board-background' ),
	foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' ),
	circuit = circuitEl.circuit,
	operationIndex = circuit.operations
		.findIndex( function( op ){

			return op === operation
		})

	operation.registerIndices.forEach( function( registerIndex, i ){

		const operationEl = document.createElement( 'div' )
		foregroundEl.appendChild( operationEl )
		operationEl.classList.add( 'Q-circuit-operation', 'Q-circuit-operation-'+ operation.gate.css )
		operationEl.setAttribute( 'operation-index', operationIndex )
		operationEl.setAttribute( 'gate-label', operation.gate.label )
		operationEl.setAttribute( 'gate-index', operation.gate.index )//  Used as an application-wide unique ID!
		operationEl.setAttribute( 'moment-index', operation.momentIndex )
		operationEl.setAttribute( 'register-index', registerIndex )
		operationEl.setAttribute( 'register-array-index', i )//  Where within the registerIndices array is this operations fragment located?
		operationEl.setAttribute( 'title', operation.gate.name )
		operationEl.style.gridColumnStart = Q.Circuit.Editor.momentIndexToGridColumn( operation.momentIndex )
		operationEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )

		const tileEl = document.createElement( 'div' )
		operationEl.appendChild( tileEl )
		tileEl.classList.add( 'Q-circuit-operation-tile' )		
		if( operation.gate.label !== '!' ) tileEl.innerText = operation.gate.label


		//  Add operation link wires
		//  for multi-qubit operations.

		if( operation.registerIndices.length > 1 ){

			operationEl.setAttribute( 'register-indices', operation.registerIndices )
			operationEl.setAttribute( 'register-indices-index', i )
			operationEl.setAttribute( 
				
				'sibling-indices', 
				 operation.registerIndices
				.filter( function( siblingRegisterIndex ){

					return registerIndex !== siblingRegisterIndex
				})
			)
			operation.registerIndices.forEach( function( registerIndex, i ){

				if( i < operation.registerIndices.length - 1 ){			

					const 
					siblingRegisterIndex = operation.registerIndices[ i + 1 ],
					registerDelta = Math.abs( siblingRegisterIndex - registerIndex ),
					start = Math.min( registerIndex, siblingRegisterIndex ),
					end   = Math.max( registerIndex, siblingRegisterIndex ),
					containerEl = document.createElement( 'div' ),
					linkEl = document.createElement( 'div' )

					backgroundEl.appendChild( containerEl )							
					containerEl.setAttribute( 'moment-index', operation.momentIndex )
					containerEl.setAttribute( 'register-index', registerIndex )
					containerEl.classList.add( 'Q-circuit-operation-link-container' )
					containerEl.style.gridRowStart = Q.Circuit.Editor.registerIndexToGridRow( start )
					containerEl.style.gridRowEnd   = Q.Circuit.Editor.registerIndexToGridRow( end + 1 )
					containerEl.style.gridColumn   = Q.Circuit.Editor.momentIndexToGridColumn( operation.momentIndex )

					containerEl.appendChild( linkEl )
					linkEl.classList.add( 'Q-circuit-operation-link' )
					if( registerDelta > 1 ) linkEl.classList.add( 'Q-circuit-operation-link-curved' )
				}
			})
			if( i === 0 ){

				operationEl.classList.add( 'Q-circuit-operation-control' )
				operationEl.setAttribute( 'title', 'Control' )
				tileEl.innerText = ''
			}
			else operationEl.classList.add( 'Q-circuit-operation-target' )
		}
	})
}




Q.Circuit.Editor.isValidControlCandidate = function( circuitEl ){

	const
	selectedOperations = Array
	.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' ))


	//  We must have at least two operations selected,
	//  hopefully a control and something else,
	//  in order to attempt a join.

	if( selectedOperations.length < 2 ) return false

	
	//  Note the different moment indices present
	//  among the selected operations.

	const moments = selectedOperations.reduce( function( moments, operationEl ){

		moments[ operationEl.getAttribute( 'moment-index' )] = true
		return moments

	}, {} )


	//  All selected operations must be in the same moment.

	if( Object.keys( moments ).length > 1 ) return false


	//  Note the different gate types present
	//  among the selected operations.

	const gates = selectedOperations.reduce( function( gates, operationEl ){

		gates[ operationEl.getAttribute( 'gate-label' )] = true
		return gates

	}, {} )


	//  One of the selected operations
	//  MUST be a control.

	if( gates[ '!' ] !== true ) return false


	//  We can only add a control to 
	//  one other kind of operation at a time.
	//  No mixing operations!

	if( Object.keys( gates ).length > 2 ) return false


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  We also need to make sure they are not already joined to anything!!!!!!!!!!!!!!!!!!
//  do we eneed to store data in register-indices too? 'siblings' ??
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	return true
}
Q.Circuit.Editor.createControl = function( circuitEl ){

	if( Q.Circuit.Editor.isValidControlCandidate( circuitEl ) !== true ) return this

	const
	circuit = circuitEl.circuit,
	selectedOperations = Array
		.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' )),
	control = selectedOperations
		.find( function( el ){

			return el.getAttribute( 'gate-label' ) === '!'
		}),
	targets = selectedOperations
		.reduce( function( targets, el ){

			if( el.getAttribute( 'gate-label' ) !== '!' ) targets.push( el )
			return targets

		}, [] )


	circuit.history.createEntry$()
	selectedOperations.forEach( function( operation ){

		circuit.clear$(

			+operation.getAttribute( 'moment-index' ),
			+operation.getAttribute( 'register-index' )
		)
	})
	circuit.set$(

		targets[ 0 ].getAttribute( 'gate-label' ),
		+control.getAttribute( 'moment-index' ),		
		[ +control.getAttribute( 'register-index' )].concat(

			targets.reduce( function( registers, operation ){

				registers.push( +operation.getAttribute( 'register-index' ))
				return registers

			}, [] )
		)
	)
	Q.Circuit.Editor.onSelectionChanged( circuitEl )
	Q.Circuit.Editor.onCircuitChanged( circuitEl )	
	return this
}




Q.Circuit.Editor.isValidSwapCandidate = function( circuitEl ){

	const
	selectedOperations = Array
	.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' ))


}
Q.Circuit.Editor.createSwap = function( circuitEl ){

	if( Q.Circuit.Editor.isValidSwapCandidate( circuitEl ) !== true ) return this


	Q.Circuit.Editor.updateToolbarAbilities( circuitEl )
}




Q.Circuit.Editor.onSelectionChanged = function( circuitEl ){

	const controlButtonEl = circuitEl.querySelector( '.Q-circuit-toggle-control' )
	if( Q.Circuit.Editor.isValidControlCandidate( circuitEl )){

		controlButtonEl.removeAttribute( 'Q-disabled' )
	}
	else controlButtonEl.setAttribute( 'Q-disabled', true )

	const swapButtonEl = circuitEl.querySelector( '.Q-circuit-toggle-swap' )
	if( Q.Circuit.Editor.isValidSwapCandidate( circuitEl )){

		swapButtonEl.removeAttribute( 'Q-disabled' )
	}
	else swapButtonEl.setAttribute( 'Q-disabled', true )
}
Q.Circuit.Editor.onCircuitChanged = function( circuitEl ){

	const circuit = circuitEl.circuit
	window.dispatchEvent( new CustomEvent( 

		'Q gui altered circuit', 
		{ detail: { circuit: circuit }}
	))

	//  Should we trigger a circuit.evaluate$() here?
	//  Particularly when we move all that to a new thread??
	//  console.log( originCircuit.report$() ) ??
}





Q.Circuit.Editor.unhighlightAll = function( circuitEl ){

	Array.from( circuitEl.querySelectorAll( 

		'.Q-circuit-board-background > div,'+
		'.Q-circuit-board-foreground > div'
	))
	.forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})
}






    //////////////////////
   //                  //
  //   Pointer MOVE   //
 //                  //
//////////////////////


Q.Circuit.Editor.onPointerMove = function( event ){


	//  We need our cursor coordinates straight away.
	//  We’ll use that both for dragging (immediately below)
	//  and for hover highlighting (further below).
	//  Let’s also hold on to a list of all DOM elements
	//  that contain this X, Y point
	//  and also see if one of those is a circuit board container.

	const 
	{ x, y } = Q.Circuit.Editor.getInteractionCoordinates( event ),
	foundEls = document.elementsFromPoint( x, y ),
	boardContainerEl = foundEls.find( function( el ){

		return el.classList.contains( 'Q-circuit-board-container' )
	})
	

	//  Are we in the middle of a circuit clipboard drag?
	//  If so we need to move that thing!

	if( Q.Circuit.Editor.dragEl !== null ){


		//  ex. Don’t scroll on touch devices!

		event.preventDefault()
		

		//  This was a very useful resource
		//  for a reality check on DOM coordinates:
		//  https://javascript.info/coordinates

		Q.Circuit.Editor.dragEl.style.left = ( x + window.pageXOffset + Q.Circuit.Editor.dragEl.offsetX ) +'px'
		Q.Circuit.Editor.dragEl.style.top  = ( y + window.pageYOffset + Q.Circuit.Editor.dragEl.offsetY ) +'px'

		if( !boardContainerEl ) Q.Circuit.Editor.dragEl.classList.add( 'Q-circuit-clipboard-destroy' )
		else Q.Circuit.Editor.dragEl.classList.remove( 'Q-circuit-clipboard-destroy' )
	}


	//  If we’re not over a circuit board container
	//  then there’s no highlighting work to do
	//  so let’s bail now.

	if( !boardContainerEl ) return


	//  Now we know we have a circuit board
	//  so we must have a circuit
	//  and if that’s locked then highlighting changes allowed!

	const circuitEl = boardContainerEl.closest( '.Q-circuit' )
	if( circuitEl.classList.contains( 'Q-circuit-locked' )) return


	//  Ok, we’ve found a circuit board.
	//  First, un-highlight everything.

	Array.from( boardContainerEl.querySelectorAll(`

		.Q-circuit-board-background > div, 
		.Q-circuit-board-foreground > div
	
	`)).forEach( function( el ){

		el.classList.remove( 'Q-circuit-cell-highlighted' )
	})


	//  Let’s prioritize any element that is “sticky”
	//  which means it can appear OVER another grid cell.

	const
	cellEl = foundEls.find( function( el ){

		const style = window.getComputedStyle( el )
		return (

			style.position === 'sticky' && ( 

				el.getAttribute( 'moment-index' ) !== null ||
				el.getAttribute( 'register-index' ) !== null
			)
		)
	}),
	highlightByQuery = function( query ){

		Array.from( boardContainerEl.querySelectorAll( query ))
		.forEach( function( el ){

			el.classList.add( 'Q-circuit-cell-highlighted' )
		})
	}


	//  If we’ve found one of these “sticky” cells
	//  let’s use its moment and/or register data
	//  to highlight moments or registers (or all).

	if( cellEl ){

		const 
		momentIndex   = cellEl.getAttribute( 'moment-index' ),
		registerIndex = cellEl.getAttribute( 'register-index' )
		
		if( momentIndex === null ){
			
			highlightByQuery( `div[register-index="${ registerIndex }"]` )
			return
		}
		if( registerIndex === null ){

			highlightByQuery( `div[moment-index="${ momentIndex }"]` )
			return
		}
		highlightByQuery(`

			.Q-circuit-board-background > div[moment-index],
			.Q-circuit-board-foreground > .Q-circuit-operation

		`)
		return
	}


	//  Ok, we know we’re hovering over the circuit board
	//  but we’re not on a “sticky” cell.
	//  We might be over an operation, but we might not.
	//  No matter -- we’ll infer the moment and register indices
	//  from the cursor position.

	const
	boardElBounds = boardContainerEl.getBoundingClientRect(),
	xLocal        = x - boardElBounds.left + boardContainerEl.scrollLeft + 1,
	yLocal        = y - boardElBounds.top  + boardContainerEl.scrollTop + 1,
	columnIndex   = Q.Circuit.Editor.pointToGrid( xLocal ),
	rowIndex      = Q.Circuit.Editor.pointToGrid( yLocal ),
	momentIndex   = Q.Circuit.Editor.gridColumnToMomentIndex( columnIndex ),
	registerIndex = Q.Circuit.Editor.gridRowToRegisterIndex( rowIndex )


	//  If this hover is “out of bounds”
	//  ie. on the same row or column as an “Add register” or “Add moment” button
	//  then let’s not highlight anything.

	if( momentIndex > circuitEl.circuit.timewidth ||
		registerIndex > circuitEl.circuit.bandwidth ) return
	

	//  If we’re at 0, 0 or below that either means
	//  we’re over the “Select all” button (already taken care of above)
	//  or over the lock toggle button.
	//  Either way, it’s time to bail.

	if( momentIndex < 1 || registerIndex < 1 ) return


	//  If we’ve made it this far that means 
	//  we have valid moment and register indices.
	//  Highlight them!

	highlightByQuery(`

		div[moment-index="${ momentIndex }"],
		div[register-index="${ registerIndex }"]
	`)
	return
}






    ///////////////////////
   //                   //
  //   Pointer PRESS   //
 //                   //
///////////////////////


Q.Circuit.Editor.onPointerPress = function( event ){


	//  This is just a safety net
	//  in case something terrible has ocurred.
	// (ex. Did the user click and then their mouse ran
	//  outside the window but browser didn’t catch it?)

	if( Q.Circuit.Editor.dragEl !== null ){

		Q.Circuit.Editor.onPressEnded( event )
		return
	}


	const 
	targetEl  = event.target,
	circuitEl = targetEl.closest( '.Q-circuit' ),
	paletteEl = targetEl.closest( '.Q-circuit-palette' )


	//  If we can’t find a circuit that’s a really bad sign
	//  considering this event should be fired when a circuit
	//  is clicked on. So... bail!

	if( !circuitEl && !paletteEl ) return


	//  This is a bit of a gamble.
	//  There’s a possibility we’re not going to drag anything,
	//  but we’ll prep these variables here anyway
	//  because both branches of if( circuitEl ) and if( paletteEl )
	//  below will have access to this scope.
	
	dragEl = document.createElement( 'div' )
	dragEl.classList.add( 'Q-circuit-clipboard' )
	const { x, y } = Q.Circuit.Editor.getInteractionCoordinates( event )


	//  Are we dealing with a circuit interface?
	//  ie. NOT a palette interface.

	if( circuitEl ){
	

		//  Shall we toggle the circuit lock?

		const
		circuit = circuitEl.circuit,
		circuitIsLocked = circuitEl.classList.contains( 'Q-circuit-locked' ),
		lockEl = targetEl.closest( '.Q-circuit-toggle-lock' )
		
		if( lockEl ){

			// const toolbarEl = Array.from( circuitEl.querySelectorAll( '.Q-circuit-button' ))
			if( circuitIsLocked ){

				circuitEl.classList.remove( 'Q-circuit-locked' )
				lockEl.innerText = '🔓'
			}
			else {

				circuitEl.classList.add( 'Q-circuit-locked' )
				lockEl.innerText = '🔒'
				Q.Circuit.Editor.unhighlightAll( circuitEl )
			}


			//  We’ve toggled the circuit lock button
			//  so we should prevent further propagation
			//  before proceeding further.
			//  That includes running all this code again
			//  if it was originally fired by a mouse event
			//  and about to be fired by a touch event!

			event.preventDefault()
			event.stopPropagation()
			return
		}


		//  If our circuit is already “locked”
		//  then there’s nothing more to do here.
		
		if( circuitIsLocked ) {

			Q.warn( `User attempted to interact with a circuit editor but it was locked.` )
			return
		}


		const
		cellEl = targetEl.closest(`

			.Q-circuit-board-foreground > div,
			.Q-circuit-palette > div
		`),
		undoEl        = targetEl.closest( '.Q-circuit-button-undo' ),
		redoEl        = targetEl.closest( '.Q-circuit-button-redo' ),
		controlEl     = targetEl.closest( '.Q-circuit-toggle-control' ),
		swapEl        = targetEl.closest( '.Q-circuit-toggle-swap' ),
		addMomentEl   = targetEl.closest( '.Q-circuit-moment-add' ),
		addRegisterEl = targetEl.closest( '.Q-circuit-register-add' )

		if( !cellEl &&
			!undoEl &&
			!redoEl &&
			!controlEl &&
			!swapEl &&
			!addMomentEl &&
			!addRegisterEl ) return


		//  By this point we know that the circuit is unlocked
		//  and that we’ll activate a button / drag event / etc.
		//  So we need to hault futher event propagation
		//  including running this exact code again if this was
		//  fired by a touch event and about to again by mouse.
		//  This may SEEM redundant because we did this above
		//  within the lock-toggle button code
		//  but we needed to NOT stop propagation if the circuit
		//  was already locked -- for scrolling and such.

		event.preventDefault()
		event.stopPropagation()


		if( undoEl && circuit.history.undo$() ){

			Q.Circuit.Editor.onSelectionChanged( circuitEl )
			Q.Circuit.Editor.onCircuitChanged( circuitEl )	
		}
		if( redoEl && circuit.history.redo$() ){

			Q.Circuit.Editor.onSelectionChanged( circuitEl )
			Q.Circuit.Editor.onCircuitChanged( circuitEl )	
		}
		if( controlEl ) Q.Circuit.Editor.createControl( circuitEl )
		if( swapEl ) Q.Circuit.Editor.createSwap( circuitEl )
		if( addMomentEl   ) console.log( '→ Add moment' )
		if( addRegisterEl ) console.log( '→ Add register' )


		//  We’re done dealing with external buttons.
		//  So if we can’t find a circuit CELL
		//  then there’s nothing more to do here.

		if( !cellEl ) return


		//  Once we know what cell we’ve pressed on
		//  we can get the momentIndex and registerIndex
		//  from its pre-defined attributes.
		//  NOTE that we are getting CSS grid column and row
		//  from our own conversion function and NOT from
		//  asking its styles. Why? Because browsers convert
		//  grid commands to a shorthand less easily parsable
		//  and therefore makes our code and reasoning 
		//  more prone to quirks / errors. Trust me!

		const
		momentIndex   = +cellEl.getAttribute( 'moment-index' ),
		registerIndex = +cellEl.getAttribute( 'register-index' ),
		columnIndex   = Q.Circuit.Editor.momentIndexToGridColumn( momentIndex ),
		rowIndex      = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )


		//  Looks like our circuit is NOT locked
		//  and we have a valid circuit CELL
		//  so let’s find everything else we could need.

		const
		selectallEl     = targetEl.closest( '.Q-circuit-selectall' ),
		registerLabelEl = targetEl.closest( '.Q-circuit-register-label' ),
		momentLabelEl   = targetEl.closest( '.Q-circuit-moment-label' ),
		inputEl         = targetEl.closest( '.Q-circuit-input' ),
		operationEl     = targetEl.closest( '.Q-circuit-operation' )
		

		//  +++++++++++++++
		//  We’ll have to add some input editing capability later...
		//  Of course you can already do this in code!
		//  For now though most quantum code assumes all qubits
		//  begin with a value of zero so this is mostly ok ;)

		if( inputEl ){

			console.log( '→ Edit input Qubit value at', registerIndex )
			return
		}


		//  Let’s inspect a group of items via a CSS query.
		//  If any of them are NOT “selected” (highlighted)
		//  then select them all.
		//  But if ALL of them are already selected
		//  then UNSELECT them all.

		function toggleSelection( query ){

			const 
			operations = Array.from( circuitEl.querySelectorAll( query )),
			operationsSelectedLength = operations.reduce( function( sum, element ){

				sum += +element.classList.contains( 'Q-circuit-cell-selected' )
				return sum
			
			}, 0 )

			if( operationsSelectedLength === operations.length ){

				operations.forEach( function( el ){

					el.classList.remove( 'Q-circuit-cell-selected' )
				})
			}
			else {

				operations.forEach( function( el ){

					el.classList.add( 'Q-circuit-cell-selected' )
				})
			}
			Q.Circuit.Editor.onSelectionChanged( circuitEl )
		}


		//  Clicking on the “selectAll” button
		//  or any of the Moment labels / Register labels
		//  causes a selection toggle.
		//  In the future we may want to add
		//  dragging of entire Moment columns / Register rows
		//  to splice them out / insert them elsewhere
		//  when a user clicks and drags them.

		if( selectallEl ){

			toggleSelection( '.Q-circuit-operation' )
			return
		}
		if( momentLabelEl ){

			toggleSelection( `.Q-circuit-operation[moment-index="${ momentIndex }"]` )
			return
		}
		if( registerLabelEl ){

			toggleSelection( `.Q-circuit-operation[register-index="${ registerIndex }"]` )
			return
		}


		//  Right here we can made a big decision:
		//  If you’re not pressing on an operation
		//  then GO HOME.

		if( !operationEl ) return


		//  Ok now we know we are dealing with an operation.
		//  This preserved selection state information
		//  will be useful for when onPointerRelease is fired.

		if( operationEl.classList.contains( 'Q-circuit-cell-selected' )){

			operationEl.wasSelected = true
		}
		else operationEl.wasSelected = false


		//  And now we can proceed knowing that 
		//  we need to select this operation
		//  and possibly drag it
		//  as well as any other selected operations.

		operationEl.classList.add( 'Q-circuit-cell-selected' )
		const selectedOperations = Array.from( circuitEl.querySelectorAll( '.Q-circuit-cell-selected' ))		
		dragEl.circuitEl = circuitEl
		dragEl.originEl  = circuitEl.querySelector( '.Q-circuit-board-foreground' )

	
		//  These are the default values; 
		//  will be used if we’re only dragging one operation around.
		//  But if dragging more than one operation
		//  and we’re dragging the clipboard by an operation
		//  that is NOT in the upper-left corner of the clipboard
		//  then we need to know what the offset is.
		// (Will be calculated below.)
		
		dragEl.columnIndexOffset = 1
		dragEl.rowIndexOffset = 1


		//  Now collect all of the selected operations,
		//  rip them from the circuit board’s foreground layer
		//  and place them on the clipboard.
		
		let
		columnIndexMin = Infinity,
		rowIndexMin = Infinity

		selectedOperations.forEach( function( el ){


			//  WORTH REPEATING:
			//  Once we know what cell we’ve pressed on
			//  we can get the momentIndex and registerIndex
			//  from its pre-defined attributes.
			//  NOTE that we are getting CSS grid column and row
			//  from our own conversion function and NOT from
			//  asking its styles. Why? Because browsers convert
			//  grid commands to a shorthand less easily parsable
			//  and therefore makes our code and reasoning 
			//  more prone to quirks / errors. Trust me!

			const
			momentIndex   = +el.getAttribute( 'moment-index' ),
			registerIndex = +el.getAttribute( 'register-index' ),
			columnIndex   = Q.Circuit.Editor.momentIndexToGridColumn( momentIndex ),
			rowIndex      = Q.Circuit.Editor.registerIndexToGridRow( registerIndex )

			columnIndexMin = Math.min( columnIndexMin, columnIndex )
			rowIndexMin = Math.min( rowIndexMin, rowIndex )
			el.classList.remove( 'Q-circuit-cell-selected' )
			el.origin = { momentIndex, registerIndex, columnIndex, rowIndex }
			dragEl.appendChild( el )
		})
		selectedOperations.forEach( function( el ){

			const 
			columnIndexForClipboard = 1 + el.origin.columnIndex - columnIndexMin,
			rowIndexForClipboard    = 1 + el.origin.rowIndex - rowIndexMin
			
			el.style.gridColumn = columnIndexForClipboard
			el.style.gridRow = rowIndexForClipboard


			//  If this operation element is the one we grabbed
			// (mostly relevant if we’re moving multiple operations at once)
			//  we need to know what the “offset” so everything can be
			//  placed correctly relative to this drag-and-dropped item.

			if( el.origin.columnIndex === columnIndex &&
				el.origin.rowIndex === rowIndex ){

				dragEl.columnIndexOffset = columnIndexForClipboard
				dragEl.rowIndexOffset = rowIndexForClipboard
			}
		})
	

		//  We need an XY offset that describes the difference
		//  between the mouse / finger press position
		//  and the clipboard’s intended upper-left position.
		//  To do that we need to know the press position (obviously!),
		//  the upper-left bounds of the circuit board’s foreground,
		//  and the intended upper-left bound of clipboard.

		const
		boardEl = circuitEl.querySelector( '.Q-circuit-board-foreground' ),
		bounds  = boardEl.getBoundingClientRect(),
		minX    = Q.Circuit.Editor.gridToPoint( columnIndexMin ),
		minY    = Q.Circuit.Editor.gridToPoint( rowIndexMin )		
		
		dragEl.offsetX = bounds.left + minX - x
		dragEl.offsetY = bounds.top  + minY - y
		dragEl.momentIndex = momentIndex
		dragEl.registerIndex = registerIndex
	}
	else if( paletteEl ){

		const operationEl = targetEl.closest( '.Q-circuit-operation' )

		if( !operationEl ) return
		
		const
		bounds   = operationEl.getBoundingClientRect(),
		{ x, y } = Q.Circuit.Editor.getInteractionCoordinates( event )

		dragEl.appendChild( operationEl.cloneNode( true ))
		dragEl.originEl = paletteEl
		dragEl.offsetX  = bounds.left - x
		dragEl.offsetY  = bounds.top  - y
	}
	dragEl.timestamp = Date.now()


	//  Append the clipboard to the document,
	//  establish a global reference to it,
	//  and trigger a draw of it in the correct spot.
	
	document.body.appendChild( dragEl )
	Q.Circuit.Editor.dragEl = dragEl
	Q.Circuit.Editor.onPointerMove( event )
}






    /////////////////////////
   //                     //
  //   Pointer RELEASE   //
 //                     //
/////////////////////////


Q.Circuit.Editor.onPointerRelease = function( event ){


	//  If there’s no dragEl then bail immediately.

	if( Q.Circuit.Editor.dragEl === null ) return
	

	//  Looks like we’re moving forward with this plan,
	//  so we’ll take control of the input now.

	event.preventDefault()
	event.stopPropagation()


	//  We can’t get the drop target from the event.
	//  Think about it: What was under the mouse / finger
	//  when this drop event was fired? THE CLIPBOARD !
	//  So instead we need to peek at what elements are
	//  under the mouse / finger, skipping element [0]
	//  because that will be the clipboard.

	const
	{ x, y } = Q.Circuit.Editor.getInteractionCoordinates( event ),
	boardContainerEl = document.elementsFromPoint( x, y )
	.find( function( el ){

		return el.classList.contains( 'Q-circuit-board-container' )
	}),
	returnToOrigin = function(){


		//  We can only do a “true” return to origin
		//  if we were dragging from a circuit.
		//  If we were dragging from a palette
		//  we can just stop dragging.

		if( Q.Circuit.Editor.dragEl.circuitEl ){
		
			Array.from( Q.Circuit.Editor.dragEl.children ).forEach( function( el ){

				Q.Circuit.Editor.dragEl.originEl.appendChild( el )
				el.style.gridColumn = el.origin.columnIndex
				el.style.gridRow    = el.origin.rowIndex
				if( el.wasSelected === true ) el.classList.remove( 'Q-circuit-cell-selected' )
				else el.classList.add( 'Q-circuit-cell-selected' )
			})
		}
		Q.Circuit.Editor.onSelectionChanged( Q.Circuit.Editor.dragEl.circuitEl )
		document.body.removeChild( Q.Circuit.Editor.dragEl )
		Q.Circuit.Editor.dragEl = null
	}


	//  If we have not dragged on to a circuit board
	//  then we’re throwing away this operation.

	if( !boardContainerEl ){
	
		if( Q.Circuit.Editor.dragEl.circuitEl ){

			const 
			originCircuitEl = Q.Circuit.Editor.dragEl.circuitEl
			originCircuit = originCircuitEl.circuit
			
			originCircuit.history.createEntry$()
			Array
			.from( Q.Circuit.Editor.dragEl.children )
			.forEach( function( child ){

				originCircuit.clear$(

					child.origin.momentIndex,
					child.origin.registerIndex
				)
			})
			Q.Circuit.Editor.onSelectionChanged( originCircuitEl )
			Q.Circuit.Editor.onCircuitChanged( originCircuitEl )
		}




		//+++++++++
		//  We should do a puff of smoke animation here
		//  like removing shit from Apple’s macOS dock!

		document.body.removeChild( Q.Circuit.Editor.dragEl )
		Q.Circuit.Editor.dragEl = null
		return
	}


	//  If we couldn’t determine a circuitEl
	//  from the drop target,
	//  or if there is a target circuit but it’s locked,
	//  then we need to return these dragged items
	//  to their original circuit.

	const circuitEl = boardContainerEl.closest( '.Q-circuit' )
	if( circuitEl.classList.contains( 'Q-circuit-locked' )){

		returnToOrigin()
		return
	}


	//  Time to get serious.
	//  Where exactly are we dropping on to this circuit??

	const 
	circuit    = circuitEl.circuit,
	bounds     = boardContainerEl.getBoundingClientRect(),
	droppedAtX = x - bounds.left + boardContainerEl.scrollLeft,
	droppedAtY = y - bounds.top  + boardContainerEl.scrollTop,
	droppedAtMomentIndex = Q.Circuit.Editor.gridColumnToMomentIndex( 

		Q.Circuit.Editor.pointToGrid( droppedAtX )
	),
	droppedAtRegisterIndex = Q.Circuit.Editor.gridRowToRegisterIndex(

		Q.Circuit.Editor.pointToGrid( droppedAtY )
	),
	foregroundEl = circuitEl.querySelector( '.Q-circuit-board-foreground' )


	//  If this is a self-drop
	//  we can also just return to origin and bail.

	if( Q.Circuit.Editor.dragEl.circuitEl === circuitEl &&
		Q.Circuit.Editor.dragEl.momentIndex === droppedAtMomentIndex &&
		Q.Circuit.Editor.dragEl.registerIndex === droppedAtRegisterIndex ){

		returnToOrigin()
		return
	}


	//  Is this a valid drop target within this circuit?

	if(
		droppedAtMomentIndex   < 1 || 
		droppedAtMomentIndex   > circuit.timewidth ||
		droppedAtRegisterIndex < 1 ||
		droppedAtRegisterIndex > circuit.bandwidth
	){

		returnToOrigin()
		return
	}
	

	//  Finally! Work is about to be done!
	//  All we need to do is tell the circuit itself
	//  where we need to place these dragged items.
	//  It will do all the validation for us
	//  and then fire events that will place new elements
	//  where they need to go!

	const draggedOperations = Array.from( Q.Circuit.Editor.dragEl.children )


	//  Whatever the next action is that we perform on the circuit,
	//  this was user-initiated via the graphic user interface (GUI).

	circuit.history.createEntry$()


	//  Whether we’ve ripped operations from THIS circuit
	//  or from another circuit
	//  we had better send “clear” commands for those positions
	//  BEFORE we try “setting” anything new down!

	if( Q.Circuit.Editor.dragEl.circuitEl ){

		const originCircuit = Q.Circuit.Editor.dragEl.circuitEl.circuit
		draggedOperations.forEach( function( childEl ){

			originCircuit.clear$(

				childEl.origin.momentIndex,			
				childEl.origin.registerIndex
			)
		})
	}


	//  Now we can safely send new operations to circuit.set().

	draggedOperations.forEach( function( childEl, i ){

		let
		momentIndexTarget   = droppedAtMomentIndex, 
		registerIndexTarget = droppedAtRegisterIndex
		
		if( Q.Circuit.Editor.dragEl.circuitEl ){

			momentIndexTarget   += childEl.origin.momentIndex   - Q.Circuit.Editor.dragEl.momentIndex
			registerIndexTarget += childEl.origin.registerIndex - Q.Circuit.Editor.dragEl.registerIndex
		}


		//  Is this a multi-register operation?

		const registerIndicesString = childEl.getAttribute( 'register-indices' )
		if( registerIndicesString ){

			
			//  The operation index acts as circuit-wide unique ID
			//  but note it can change whenever a SET / CLEAR or SORT occurs!

			const
			operationIndex = +childEl.getAttribute( 'operation-index' ),


			//  What are ALL of the registerIndices
			//  associated with this multi-register operation?
			// (We may use them later as a checklist.)

			registerIndices = registerIndicesString
			.split( ',' )
			.map( function( str ){ return +str }),

			
			//  The unassuming “gateIndex” is actually an
			//  application-wide unique ID
			//  assigned to each Q.Gate instance upon creation.
//++++++++ this instead should be an operationIndex number unique to the circuit!!!!!!!
// because there are only like 10 gate instances total! everything else is a reference!!!!
			
			gateIndex = childEl.getAttribute( 'gate-index' ),


			//  What 
			
			foundComponents = Array.from( 

				Q.Circuit.Editor.dragEl.querySelectorAll( 

					`[gate-index="${ gateIndex }"][register-indices="${ registerIndicesString }"]` 
				)
			),


			//  We can’t pick the gate label off the 0th gate in the register indices array
			//  because that will be an identity / control / null gate.
			//  We need to look at 1 or higher.

			component1 = Q.Circuit.Editor.dragEl.querySelector( 

				`[gate-index="${ gateIndex }"][register-index="${ registerIndices[ 1 ] }"]`
			),
			gateLabel = component1 ? component1.getAttribute( 'gate-label' ) : childEl.getAttribute( 'gate-label' )



console.log( '\n\n\nthis is a multi-register operation' )
console.log( 'the gate label is', gateLabel, 'and the app-wide gate index ID is', gateIndex )




			//  If we are dragging all of the components
			//  of a multi-register operation
			//  then we are good to go.

			if( registerIndices.length === foundComponents.length ){

				circuit.set$( 

					gateLabel,
					momentIndexTarget,


					//  We need to remap EACH register index here
					//  acoording to the drop position.
					//  Let’s let set$ do all the validation on this.
					
					registerIndices.map( function( registerIndex ){

						const siblingDelta = registerIndex - childEl.origin.registerIndex
						registerIndexTarget = droppedAtRegisterIndex
						if( Q.Circuit.Editor.dragEl.circuitEl ){

							registerIndexTarget += childEl.origin.registerIndex - Q.Circuit.Editor.dragEl.registerIndex + siblingDelta
						}
						return registerIndexTarget
					})
				)
			}


			//  It appears we are NOT dragging all components
			//  of a multi-register operation.
			//  But if we’re dragging within the same circuit
			//  and we’re staying within the same moment index
			//  that might be ok!

			else if( Q.Circuit.Editor.dragEl.circuitEl === circuitEl &&
				momentIndexTarget === childEl.origin.momentIndex ){
				




/*


+++++++++++++++++++++++++++++++++++++++++++++++

Ok. We need to know which siblings we are dragging
and what their registerIndices # number is
so we can update ONLY THOSE with new registerIndexTarget values
while leaving the other sibling registerIndex values as they were



*/

console.log( 'about to edit SOME of this multi-register op', childEl.origin.registerIndex )


/*
				const testmap = registerIndices.map( function( registerIndex ){

					const siblingDelta = registerIndex - childEl.origin.registerIndex
					registerIndexTarget = droppedAtRegisterIndex
					if( Q.Circuit.Editor.dragEl.circuitEl ){

						registerIndexTarget += childEl.origin.registerIndex - Q.Circuit.Editor.dragEl.registerIndex + siblingDelta
					}
					return registerIndexTarget
				})
				// console.log( 'testmap', testmap )
*/


console.log( Q.Circuit.Editor.dragEl )
console.log( 'gateIndex', gateIndex )




const draggedSiblingRegisterIndices = Array
.from( Q.Circuit.Editor.dragEl.querySelectorAll( 

	`[gate-index="${ gateIndex }"]`
))
.sort( function( a, b ){

	const 
	aRegisterIndicesIndex = +a.getAttribute( 'register-indices-index' ),
	bRegisterIndicesIndex = +b.getAttribute( 'register-indices-index' )
	
	return aRegisterIndicesIndex - bRegisterIndicesIndex
})


draggedSiblingRegisterIndices
.forEach( function( e, i ){

	console.log( '#', i, +e.getAttribute( 'register-indices-index' ))
})
//console.log(componentz.length, componentz)


/*


Ok. Now I know what siblings are being dragged
and what their registerIndicesIndex is for each
they are sorted in ascending order.

which means I can step thru this operations's register indices
start "r" at zero
and when i hit a registerIndicesIndex that matches
	(componentz[ r ] === ???operation.registerIndices???)
i can modify its register-index according to the drop!
	and increment my "r" r++


*/


let r = 0
const fixedRegisterIndices = registerIndices
.reduce( function( fixedRegisterIndices, componentRegisterIndex, i ){

	if( r < draggedSiblingRegisterIndices.length ){

		const draggedSiblingRegisterIndex = +draggedSiblingRegisterIndices[ r ].getAttribute( 'register-index' )
		console.log( r, 'draggedSiblingRegisterIndex', draggedSiblingRegisterIndex )
		console.log( i, 'componentRegisterIndex', componentRegisterIndex )

		if( componentRegisterIndex === draggedSiblingRegisterIndex ){

			fixedRegisterIndices.push(

				//
				 droppedAtRegisterIndex + componentRegisterIndex - Q.Circuit.Editor.dragEl.registerIndex
			)
			r ++
		}
	}
	else fixedRegisterIndices.push( componentRegisterIndex )//  Unmodified by drag.
	return fixedRegisterIndices

}, [])






				circuit.set$( 

					childEl.getAttribute( 'gate-label' ), 
					momentIndexTarget,
					fixedRegisterIndices
					/*registerIndices
					.reduce( function( newRegisterIndices, reg ){

						if( reg !== registerIndexTarget ){

							if( reg === childEl.origin.registerIndex ) newRegisterIndices.push( registerIndexTarget )
							else newRegisterIndices.push( reg )
						}
						return newRegisterIndices

					}, [] )
					*/
				)
			}
			else {





//+++++++++++++++++++++++++++++
				

//  It’s all getting broken up.
//  BUT
//  is there a way to keep SOME of it together?

//  like if it’s i-X-X
//  and you drag the i-X to a new register, can that stay together as just i-X?
//  and the left-behind X becomes a lone X?







			}



//+++++ we should SPLICE the draggedOperations array
//  to remove all the other siblings!
//  otherwise we are processing them multiple times!

console.log( '\n\n\nFinished processing 1st of a multi-register op. Now looking at siblings...' )
console.log( 'gateIndex', gateIndex )
console.log( 'registerIndexTarget', registerIndexTarget )

let j = i + 1
while( j < draggedOperations.length ){

	const possibleSibling = draggedOperations[ j ]
	if( possibleSibling.getAttribute( 'gate-index' ) === gateIndex ){

		console.log( 'found a sibling at', j, ' w gate index:', gateIndex )
		draggedOperations.splice( j, 1 )
	}
	else j ++
}
/*
for( let j = i + 1; j < draggedOperations.length; j ++ ){

	const possibleSibling = draggedOperations[ j ]
	if( possibleSibling.getAttribute( 'gate-index' ) === gateIndex ){

		console.log( 'found a sibling at', j, ' w gate index:', gateIndex )
		draggedOperations.splice( j, 1 )
	}
}
*/




		}
		else {

			circuit.set$( 

				childEl.getAttribute( 'gate-label' ), 
				momentIndexTarget,
				[ registerIndexTarget ]
			)
		}
	})
	

	//  Are we capable of making controls? Swaps?

	Q.Circuit.Editor.onSelectionChanged( circuitEl )
	Q.Circuit.Editor.onCircuitChanged( circuitEl )


	//  If the original circuit and destination circuit
	//  are not the same thing
	//  then we need to also eval the original circuit.

	if( Q.Circuit.Editor.dragEl.circuitEl &&
		Q.Circuit.Editor.dragEl.circuitEl !== circuitEl ){

		const originCircuit = Q.Circuit.Editor.dragEl.circuitEl.circuit
		Q.Circuit.Editor.onSelectionChanged( originCircuit )
		Q.Circuit.Editor.onCircuitChanged( originCircuit )
	}


	//  We’re finally done here.
	//  Clean up and go home.
	//  It’s been a long journey.
	//  I love you all.

	document.body.removeChild( Q.Circuit.Editor.dragEl )
	Q.Circuit.Editor.dragEl = null
}






    ///////////////////
   //               //
  //   Listeners   //
 //               //
///////////////////


window.addEventListener( 'DOMContentLoaded', function( event ){


	//  These listeners must be applied
	//  to the entire WINDOW (and not just document.body!)

	window.addEventListener( 'mousemove',  Q.Circuit.Editor.onPointerMove )
	window.addEventListener( 'touchmove',  Q.Circuit.Editor.onPointerMove )
	window.addEventListener( 'mouseup',    Q.Circuit.Editor.onPointerRelease )
	window.addEventListener( 'touchend',   Q.Circuit.Editor.onPointerRelease )
})






