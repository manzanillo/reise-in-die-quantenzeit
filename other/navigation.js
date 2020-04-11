
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




let hashTarget
function onHashChange(){

	if( hashTarget    ) hashTarget.classList.remove( 'hash-target' )
	if( location.hash ) hashTarget = document.getElementById( location.hash.substr( 1 ))
	if( hashTarget    ){

		hashTarget.classList.add( 'hash-target' )
		setTimeout( function(){

			const 
			//nav = document.getElementsByTagName( 'nav' )[ 0 ],
			//navIsExpanded = nav.classList.contains( 'expand' ),
			//navHeight = nav.offsetHeight,
			rootEm = parseFloat( window.getComputedStyle( document.body ).fontSize ),
			dropAmount = rootEm * 10// + ( navIsExpanded === true ? navHeight : 0 )

			window.scrollTo( 

				hashTarget.offsetLeft,
				hashTarget.offsetTop - dropAmount
			)

		}, 10 )
	}
}
window.addEventListener( 'hashchange', onHashChange, false )




document.addEventListener( 'DOMContentLoaded', function(){

	const 
	nav = document.createElement( 'nav' ),
	home = window.location.protocol === 'file:' ? 'index.html' : '/'
	
	nav.innerHTML = `
		<header>
			<h1>
				<!-- a href="index.html" -->
					<svg viewBox="0 0 600 600" role="img">
						<title>Q.js</title>

<path d="M527.607,300.241l-0.069-0.295l-0.025-0.494l0.011-0.197l-0.013,0.163l-0.771-15.212l0.041-0.439l0.115,0.269l-0.087-0.563
		l0.039-0.427l-0.166-0.393l-0.029-0.189l-0.019-0.377l-0.015,0.16l-0.059-0.384l-0.667-8.293l0.066,0.255l-0.093-0.588
		l-0.032-0.403l-0.08-0.313l-2.322-14.748l-0.046-0.625l0.002,0.008l-0.002-0.01l-0.022-0.295l0.127,0.269l-0.148-0.552
		l-0.031-0.426l-0.192-0.41l-0.022-0.081l-0.072-0.456l0.02,0.263l-0.395-1.479l-1.554-6.699l0.081,0.257l-0.155-0.574l-0.091-0.395
		l-0.102-0.325l-3.45-12.836l-0.423-1.87l0.025,0.064l-0.026-0.07l-0.051-0.227l0.146,0.266l-0.207-0.534l-0.094-0.417l-0.23-0.42
		l-0.005-0.013l-0.132-0.489l0.085,0.37L515,226.283l-1.426-3.829l0.103,0.254l-0.214-0.55l-0.143-0.384l-0.136-0.334l-2.34-6.02
		l0.146,0.194l-0.255-0.499l-0.094-0.43l-0.171-0.228l-0.975-2.508l-1.574-4.292l0.039,0.075l-0.043-0.085l-0.076-0.206l0.173,0.258
		l-0.264-0.507l-0.147-0.402l-0.269-0.403l-0.187-0.48l0.166,0.446l-1.35-2.588l-2.204-4.378l0.135,0.247l-0.273-0.522l-0.185-0.367
		l-0.183-0.335l-2.959-5.656l0.14,0.154l-0.277-0.417l-0.048-0.093l-0.133-0.371l-0.144-0.159l-1.237-2.365l-1.842-3.703
		l0.026,0.038l-0.034-0.054l-0.116-0.234l0.207,0.246l-0.32-0.473l-0.191-0.384l-0.311-0.37l-0.239-0.458l0.216,0.43l-0.021-0.025
		l-0.231-0.342l-3.653-5.836l0.174,0.235l-0.332-0.487l-0.218-0.348l-0.245-0.33l-6.812-9.99l-0.949-1.533l0.248,0.227l-0.374-0.429
		l-0.227-0.366l-0.328-0.301l-0.12-0.163l-0.198-0.29l0.091,0.145l-3.647-4.927l0.023,0.026l-0.027-0.031l-0.159-0.215l0.221,0.214
		l-0.387-0.439l-0.246-0.333l-0.332-0.323l-1.276-1.446l-3.454-4.027l0.189,0.206l-0.409-0.463l-0.249-0.29l-0.219-0.238
		l-3.266-3.691l0.249,0.17l-0.424-0.376l-0.256-0.35l-0.155-0.106l-0.871-0.984l-3.207-3.785l0.274,0.184l-0.438-0.378l-0.272-0.321
		l-0.293-0.198l-4.502-4.7l0.249,0.168l-0.462-0.39l-0.273-0.286l-0.328-0.223l-0.119-0.1l-4.861-4.556l0.223,0.156l-0.508-0.423
		l-0.247-0.231l-0.2-0.141l-3.776-3.143l-1.818-1.539l0.203,0.163l-0.658-0.548l-0.11-0.093l-0.053-0.043l-0.435-0.362l-0.967-0.919
		l0.314,0.118l-0.506-0.3l-0.298-0.283l-0.217-0.082l-4.455-3.867l0.295,0.085l-0.543-0.301l-0.284-0.247l-0.244-0.072l-4.778-3.848
		l0.278,0.037l-0.626-0.317l-0.223-0.179l-0.188-0.029l-0.178-0.09l-5.01-3.847l0.236-0.087l-0.791-0.339l-0.031-0.024l-0.016,0.004
		l-1.117-0.479l-4.873-3.461l-0.012-0.068l-0.173-0.063l-0.576-0.409l0.011,0.202l-0.789-0.289l-4.924-3.053l-0.224-0.256
		l-0.38-0.119l-0.5-0.31l0.174,0.201l-2.147-1.206l0.02-0.064l-0.108,0.015l-3.043-1.71l-0.138-0.113l0.232,0.034l-0.496-0.252
		l-0.349-0.287l-0.299-0.041l-1.304-0.661l-0.017-0.074l-0.065,0.033l-3.048-1.545l-1.591-1.169l0.081-0.135l-0.61-0.254
		l-0.276-0.203l-0.042,0.07l-6.475-2.695l-0.012-0.007l-0.184-0.187l-0.467-0.196l-0.423-0.248l0.119,0.121l-6.052-2.534
		l-0.278-0.193l-0.472-0.184l-0.436-0.229l0.194,0.135l-6.055-2.358l-0.313-0.185l-0.481-0.17l-0.441-0.212l0.24,0.141l-6.039-2.129
		l-0.322-0.171l-0.489-0.153l-0.445-0.198l0.271,0.144l-5.977-1.869l-0.32-0.156l-0.497-0.135l-0.448-0.185l0.294,0.143
		l-5.863-1.585l-0.314-0.143l-0.505-0.114l-0.449-0.172l0.312,0.141l-5.696-1.281l-0.307-0.13l-0.512-0.09l-0.452-0.16l0.327,0.138
		l-0.81-0.142l-1.033-0.244l-3.008-0.698l-5.066-1.202l-0.508-0.092l-0.471-0.11l0.457,0.108l-0.003-0.001l-0.455-0.105l0.435,0.102
		l-6.524-1.187l-0.755-0.175l-0.514-0.065l-0.471-0.101l0.39,0.09l-0.1-0.013l-0.295-0.054l0.188,0.04l-6.096-0.773l0.373,0.028
		l-0.411-0.033l-0.015-0.002l0.426,0.03l-0.474-0.036l-0.513-0.115l-0.519-0.034l-0.471-0.09l0.375,0.083l-0.199-0.013l-0.184-0.023
		l0.091,0.017l-3.903-0.254l-2.122-0.172l-0.203-0.043l-0.305,0.002l-0.441-0.036l-0.247-0.041l0.162,0.034l-5.004-0.405
		l-5.261-0.365l-3.157-0.258l-0.518,0l-0.48-0.037l0.458,0.037h-0.009l-0.45-0.031l0.409,0.031l-6.625,0.004l-0.083-0.006
		l0.348-0.02l-0.385,0.017l-0.022-0.002l0.406-0.032l-0.473,0.027l-0.526-0.041l-0.518,0.043l-0.479-0.024l0.405,0.031l-0.103,0.009
		l-0.303,0l0.186,0.009l-1.121,0.093l-12.951,0.576l-6.929,0.547l-1.071,0.048l0.431-0.072l-0.445,0.072l-0.002,0l0.447-0.077
		l-0.471,0.078l-0.523,0.023l-0.511,0.09l-0.48,0.028l0.44-0.02l-0.025,0.004l-0.414,0.033l0.339-0.02l-4.127,0.729l-2.138,0.348
		l0.007-0.002l-0.021,0.004l-0.6,0.098l-0.37,0.018l-0.309,0.092l-0.545,0.089l-0.122,0.011l0.08-0.004l-6.457,1.052l-3.899,0.675
		l-4.526,0.729l0.429-0.121l-0.441,0.123l-0.002,0l0.441-0.127l-0.461,0.13l-0.515,0.083l-0.497,0.145l-0.475,0.079l0.463-0.076
		l-0.004,0.001l-0.458,0.079l0.435-0.072l-5.002,1.457l-1.85,0.518l0.176-0.078l-0.444,0.147l-0.527,0.086l-0.399,0.178
		l-0.246,0.069l-0.299,0.062l0.195-0.033l-6.434,1.8l-2.394,0.69l-6.163,1.71l0.341-0.14l-0.374,0.15l-0.016,0.005l0.385-0.167
		l-0.443,0.183l-0.502,0.14l-0.474,0.207l-0.464,0.131l0.456-0.128l-0.002,0.001l-0.453,0.131l0.438-0.124l-1.497,0.653
		l-13.23,5.297l-6.431,2.776l-1.977,0.787l0.203-0.114l-0.254,0.134l-0.072,0.028l0.309-0.191l-0.416,0.234l-0.486,0.193
		l-0.438,0.273l-0.447,0.184l0.425-0.171l-0.008,0.005l-0.412,0.178l0.375-0.154l-0.421,0.263l-13.904,7.362l-7.501,4.626
		l-0.507,0.268l0.068-0.05l-0.102,0.068l-0.176,0.093l0.24-0.21l-0.383,0.286l-0.462,0.244l-0.387,0.34l-0.422,0.238l0.385-0.205
		l-0.021,0.019l-0.348,0.214l0.288-0.162l-0.043,0.038l-13.157,8.856l0.332-0.283l-0.347,0.293l-0.002,0.002l0.346-0.299
		l-0.369,0.314l-0.428,0.288l-3.291,2.854l-4.196,3.54l0.032-0.04l-0.097,0.095l-0.44,0.371l-0.238,0.16l-0.099,0.124l-4.329,3.652
		l-3.675,3.169l-4.544,3.812l0.14-0.156l-0.189,0.197l-0.07,0.059l0.23-0.281l-0.324,0.36l-0.396,0.332l-0.324,0.398l-0.371,0.316
		l0.364-0.307l-0.001,0.001l-0.359,0.31l0.348-0.297l-0.262,0.322l-10.993,11.449l-6.83,8.31l-0.312,0.324l0.033-0.048l-0.057,0.074
		l-0.162,0.168l0.157-0.282l-0.272,0.402l-0.358,0.372l-0.247,0.447l-0.327,0.363l0.298-0.311l-0.016,0.028l-0.253,0.308
		l0.154-0.171l-9.503,12.27l0.178-0.302l-0.209,0.342l-0.013,0.017l0.207-0.367l-0.248,0.42l-0.313,0.405l-0.859,1.53l-7.632,12.473
		l-5.314,9.397l-1.393,2.263l-0.168,0.481l-0.249,0.422l0.237-0.388l-0.003,0.009l-0.219,0.388l0.205-0.347l-4.179,11.938
		l-0.341,0.553l-0.081,0.502l-0.215,0.441l0.196-0.319l-0.025,0.157l-0.073,0.208l0.059-0.12l-2.113,13.142l-0.239,0.388
		l0.005,0.507l-0.179,0.457l0.181-0.294l0.151,14.657l-0.199,0.324l0.085,0.5l-0.141,0.47l0.173-0.282l2.672,15.792l-0.177,0.29
		l0.155,0.482l-0.101,0.48l0.167-0.274l5.372,16.752l-0.163,0.27l0.215,0.458l-0.061,0.486l0.163-0.27l8.201,17.492l-0.152,0.257
		l0.266,0.431l-0.022,0.489l0.159-0.267l11.095,17.964l-0.145,0.248l0.31,0.402l0.016,0.488l0.155-0.266l13.975,18.126l-0.138,0.242
		l0.347,0.371l0.053,0.485l0.152-0.266l16.756,17.943l-0.133,0.237l0.378,0.34l0.087,0.48l0.15-0.267l19.341,17.393l-0.127,0.233
		l0.405,0.308l0.12,0.472l0.147-0.269l21.637,16.467l-0.122,0.229l0.429,0.276l0.15,0.463l0.146-0.273l23.556,15.176l-0.117,0.225
		l0.449,0.243l0.177,0.453l0.145-0.279l25.023,13.55l-0.111,0.22l0.467,0.209l0.202,0.443l0.145-0.287l25.982,11.634l-0.105,0.213
		l0.482,0.173l0.224,0.431l0.147-0.298l26.402,9.49l-0.098,0.204l0.494,0.135l0.243,0.42l0.15-0.313l26.279,7.191l-0.09,0.193
		l0.504,0.095l0.26,0.409l0.155-0.331l25.631,4.814l-0.081,0.178l0.511,0.051l0.275,0.399l0.161-0.355l24.503,2.439l-0.07,0.159
		l0.515,0.003l0.287,0.39l0.171-0.387l22.957,0.138l-0.058,0.135l0.513-0.049l0.297,0.382l0.185-0.428l0.329-0.032l0.178,0.001
		l-0.013-0.017l20.572-1.975l-0.043,0.103l0.505-0.107l0.305,0.375l0.196-0.464l0.488-0.047l-0.051-0.062l18.479-3.896l-0.025,0.06
		l0.408-0.141l0.088-0.019l0.301,0.363l0.194-0.467l0.476-0.1l-0.091-0.11l16.218-5.591l0,0.001l0.006-0.003l0.503-0.174
		l0.262,0.315l0.191-0.471l0.455-0.157l-0.134-0.161l14.403-7.304l0.217,0.271l0.19-0.478l0.421-0.214l-0.174-0.218l12.043-8.598
		l0.169,0.232l0.192-0.489l0.372-0.265l-0.173-0.24l0.05-0.128l9.611-9.563l0.117,0.201l0.199-0.516l0.301-0.299l-0.111-0.193
		l0.288-0.747l6.97-9.889l0.058,0.188l0.227-0.592l0.197-0.28l-0.039-0.132l1.734-4.52l3.148-6.931l-0.04,0.193l0.302-0.77
		l0.07-0.155l0.012-0.054l4.584-11.661l1.294-2.786l0.027,0.208l0.17-0.632l0.142-0.306l-0.018-0.153l4.015-14.889l0.289-0.61
		l0.072,0.231l0.093-0.581l0.173-0.365l-0.075-0.245l0.27-1.682l2.357-9.096l0.005,0.22l0.104-0.642l0.087-0.337l-0.004-0.179
		l2.363-14.617l0.298-1.115l0.061,0.242l0.032-0.593l0.104-0.389l-0.068-0.272l0.328-6.018l0.348-4.463l-0.004,0.228l0.036-0.636
		l0.028-0.362l0.004-0.206l0.274-4.824l0.042,0.102l-0.022-0.465l0.008-0.149l0.102-0.367l-0.071-0.173l0.314-5.521l0.362-4.284
		l0.059,0.25l-0.03-0.595L527.607,300.241z M363.303,374.5l-16.2-16.2c-12.9,9.3-28.801,14.7-47.1,14.7
		c-45.001,0-78.001-33-78.001-78.001c0-45,33-78,78.001-78c45,0,78.001,33,78.001,78c0,18.301-5.4,34.501-14.7,47.101l16.2,16.2
		L363.303,374.5z"/>
	<path d="M300.002,245.499c-27.001,0-46.501,21-46.501,49.5c0,28.501,19.5,49.501,46.501,49.501c9.6,0,18.6-2.7,25.8-7.5l-18.9-18.9
		l16.2-16.2l17.7,18c3.6-7.2,5.699-15.6,5.699-24.9C346.502,266.499,327.002,245.499,300.002,245.499z"/>
<polygon points="477.065,443.08 489.175,425.543 478.518,436.435 478.548,436.299 478.301,436.657 477.899,437.067 477.875,437.183 
	465.552,446.133 465.527,445.95 465.256,446.348 464.82,446.665 464.842,446.823 450.197,454.397 450.114,454.168 449.833,454.585 
	449.371,454.824 449.413,454.939 432.471,460.949 432.333,460.674 432.052,461.097 431.569,461.269 431.599,461.328 
	412.466,465.552 412.278,465.23 412,465.655 411.503,465.765 411.504,465.768 390.361,467.999 390.127,467.625 389.856,468.05 
	366.478,468.115 366.417,468.109 366.147,467.687 365.913,468.063 341.436,465.815 341.443,465.804 340.952,465.715 340.684,465.29 
	340.48,465.629 314.873,460.982 314.903,460.93 314.422,460.801 314.159,460.371 313.979,460.682 287.733,453.624 287.779,453.541 
	287.31,453.373 287.057,452.937 286.897,453.226 260.542,443.827 260.599,443.72 260.144,443.517 259.904,443.072 259.76,443.345 
	233.846,431.754 233.909,431.63 233.471,431.392 233.248,430.939 233.116,431.199 208.184,417.641 208.25,417.503 207.833,417.232 
	207.628,416.77 207.507,417.02 184.065,401.783 184.132,401.637 183.737,401.333 183.554,400.862 183.442,401.105 161.941,384.525 
	162.007,384.374 161.639,384.037 161.479,383.558 161.376,383.796 142.191,366.239 142.254,366.087 141.917,365.718 
	141.783,365.231 141.686,365.466 125.103,347.308 125.162,347.159 124.863,346.76 124.757,346.266 124.666,346.497 110.875,328.108 
	110.929,327.967 110.673,327.538 110.598,327.04 110.511,327.267 99.61,308.993 99.658,308.863 99.453,308.407 99.409,307.906 
	99.328,308.128 91.325,290.277 91.365,290.167 91.22,289.688 91.21,289.186 91.134,289.4 85.964,272.233 85.993,272.151 
	85.918,271.657 85.941,271.156 85.872,271.355 83.41,255.078 83.422,255.044 83.425,254.544 83.483,254.047 83.426,254.213 
	83.509,238.905 83.574,238.532 83.666,238.041 83.651,238.088 86.077,224.083 86.29,223.273 86.137,223.737 86.22,223.255 
	85.923,224.386 79.562,243.668 77.038,257.811 77.04,257.793 77.003,258.011 76.959,258.141 76.965,257.786 76.915,258.274 
	76.753,258.758 76.746,259.266 76.62,259.741 76.744,259.369 76.743,259.47 76.691,259.759 76.718,259.655 73.521,278.139 
	73.183,293.51 73.183,293.509 73.182,293.526 73.177,293.789 73.16,293.883 73.114,293.513 73.138,294.005 73.049,294.505 
	73.113,295.008 73.062,295.498 73.128,295.126 73.144,295.255 73.139,295.506 73.151,295.389 72.854,313.007 74.846,329.374 
	74.796,329.129 74.847,329.473 74.846,329.527 74.745,329.139 74.844,329.623 74.832,330.13 74.961,330.619 74.985,331.112 
	74.993,330.744 75.03,330.881 75.057,331.109 75.05,330.958 75.096,331.133 77.466,346.968 81.72,363.411 81.752,363.634 
	81.614,363.264 81.758,363.682 81.76,363.691 81.594,363.271 81.766,363.735 81.837,364.236 82.024,364.706 82.123,365.19 
	82.07,364.823 82.114,364.931 82.177,365.179 82.141,365.001 82.672,366.336 86.924,378.688 92.979,394.065 93.45,395.457 
	93.688,395.902 93.86,396.366 93.727,395.975 93.744,396.008 93.882,396.358 93.771,396.057 102.154,411.739 102.156,411.748 
	101.933,411.405 102.172,411.795 102.173,411.8 101.913,411.418 102.184,411.833 102.336,412.315 102.621,412.732 102.823,413.183 
	102.729,412.888 103.734,414.358 108.749,422.586 118.513,436.986 119.135,438.027 119.46,438.414 119.73,438.829 119.533,438.501 
	119.575,438.551 119.753,438.814 119.607,438.59 131.227,452.437 131.254,452.473 131.539,452.988 131.9,453.34 132.196,453.738 
	132.064,453.501 145.313,466.468 145.422,466.597 145.219,466.429 145.426,466.602 145.431,466.608 145.217,466.432 145.433,466.61 
	145.663,466.881 145.813,467.206 146.206,467.523 146.525,467.9 146.436,467.709 160.977,479.458 161.676,480.189 161.745,480.423 
	162.169,480.704 162.507,481.057 162.46,480.897 163.897,481.852 165.303,483.031 165.72,483.313 166.104,483.629 165.749,483.333 
	165.752,483.335 166.106,483.626 165.759,483.34 178.496,491.973 179.056,492.371 179.056,492.379 179.099,492.402 179.855,492.94 
	179.864,492.949 179.864,492.947 180.775,493.596 181.012,493.835 181.452,494.078 181.857,494.366 181.714,494.222 
	190.653,499.145 197.283,503.296 197.249,503.383 197.775,503.604 198.138,503.831 198.164,503.767 213.652,510.281 
	214.685,510.795 214.484,510.77 214.966,510.935 215.407,511.154 215.719,511.193 216.259,511.378 216.359,511.42 216.314,511.397 
	217.572,511.827 217.622,511.863 217.639,511.85 232.096,516.799 232.944,517.121 232.508,517.019 232.997,517.141 233.461,517.317 
	233.921,517.423 234.42,517.594 234.055,517.454 236.517,518.023 236.819,518.203 236.633,518.275 237.146,518.399 237.555,518.643 
	237.789,518.554 256.802,523.131 256.988,523.221 256.743,523.275 257.26,523.353 257.693,523.563 258.083,523.476 258.493,523.537 
	258.663,523.579 258.618,523.556 276.993,526.311 276.686,526.355 277.205,526.384 277.658,526.55 278.13,526.481 278.645,526.558 
	278.349,526.45 278.353,526.449 296.425,527.466 296.126,527.498 296.621,527.477 296.654,527.479 297.115,527.582 297.579,527.531 
	298.11,527.561 297.847,527.501 298.971,527.376 315.447,526.672 315.758,526.683 316.202,526.64 316.755,526.616 316.529,526.607 
	324.751,525.796 326.762,525.714 326.757,525.716 326.773,525.713 327.402,525.687 327.724,525.814 328.161,525.656 
	328.687,525.635 328.465,525.546 328.841,525.411 346.43,522.84 346.637,522.888 347.042,522.75 347.6,522.669 347.413,522.625 
	349.764,521.828 363.977,518.055 364.067,518.049 364.352,517.956 365.025,517.777 364.867,517.787 373.931,514.815 
	378.447,513.655 378.586,513.737 378.962,513.523 379.485,513.388 379.345,513.304 380.754,512.502 395.131,506.945 
	395.166,506.962 395.341,506.863 396.034,506.596 395.924,506.536 407.698,499.918 409.957,499.05 410.054,499.177 410.437,498.866 
	410.869,498.7 410.783,498.584 412.059,497.545 424.92,490.594 424.955,490.709 425.454,490.305 425.697,490.174 425.683,490.12 
	438.118,480.058 439.549,479.282 439.609,479.457 439.983,479.047 440.346,478.851 440.297,478.704 441.355,477.544 
	452.387,469.258 452.371,469.426 452.843,468.915 453.066,468.747 453.076,468.664 465.036,455.711 466.013,454.984 
	466.043,455.194 466.365,454.722 466.695,454.476 466.668,454.279 467.406,453.2 476.465,443.817 476.424,444.008 476.787,443.484 
	477.033,443.229 "/>
	<path d="M474.747,490.002h6v18.6c0,6.899-5.1,12-12,12c-6.899,0-11.999-5.101-11.999-12h6c0,3.6,2.579,6.3,5.999,6.3s6-2.7,6-6.3
		V490.002z"/>
	<path d="M511.047,510.821c0-2.399-2.641-3.42-8.64-3.42c-9.479,0-13.56-2.52-13.56-8.579c0-6.12,4.8-9.42,13.8-9.42
		c8.279,0,13.799,3.84,13.799,9.6h-6c0-2.52-3.12-4.2-7.799-4.2c-5.101,0-7.8,1.381-7.8,4.021c0,2.279,2.399,3.18,8.1,3.18
		c9.899,0,14.099,2.7,14.099,8.819c0,6.36-5.039,9.78-14.398,9.78c-8.64,0-14.399-3.84-14.399-9.6h5.999
		c0,2.52,3.36,4.199,8.4,4.199C508.106,515.201,511.047,513.642,511.047,510.821z"/>







					</svg>
				<!-- /a -->
			</h1>
		</header>
		<ul>
			<li><h2><a href="${ home }">What is Q?</a></h2></li>
			<li><h2><a href="playground.html">Playground</a></h2></li>
			<li><h2><a href="resources.html">Resources</a></h2></li>
		</ul>
		<p>API documentation</p>
		<ul>
			<li><h2><a href="Q.html"><code>Q</code></a></h2></li>
			<li><h2><a href="ComplexNumber.html"><code>ComplexNumber</code></a></h2></li>
			<li><h2><a href="Matrix.html"><code>Matrix</code></a></h2></li>
			<li><h2><a href="Qubit.html"><code>Qubit</code></a></h2></li>
			<li><h2><a href="Gate.html"><code>Gate</code></a></h2></li>
			<li><h2><a href="Circuit.html"><code>Circuit</code></a></h2></li>			
		</ul>
		<div id="veggie-burger">
			<div id="vb-top-dexter"></div>
			<div id="vb-middle"></div>
			<div id="vb-bottom-sinister"></div>
		</div>
	`
	document.body.appendChild( nav )
	// document.body.prepend( nav )
	Array.from( nav.getElementsByTagName( 'a' )).forEach( function( link ){

		if( link.pathname === document.location.pathname ||
			link.pathname === document.location.pathname +'index.html' ){
			
			link.classList.add( 'selected' )
		}
	})
	if( nav.querySelectorAll( 'h1 a.selected' ).length ){

		nav.classList.add( 'home' )
	}


	const 
	vb = document.getElementById( 'veggie-burger' ),
	vbOpen  = function(){

		nav.classList.add( 'expand' )
		vb.isOpen = true
	},
	vbClose = function(){

		nav.classList.remove( 'expand' )
		vb.isOpen = false
	},
	vbToggle = function( event ){

		event.preventDefault()
		event.stopPropagation()
		if( vb.isOpen ) vbClose()
		else vbOpen()
	}
	
	vb.isOpen = false
	//vb.addEventListener( 'mousedown', vbToggle )
	// vb.addEventListener( 'touchstart', vbToggle )
	vb.addEventListener( 'click', vbToggle )
	document.querySelector( 'main' ).addEventListener( 'click', vbClose )

	
	Array.from( document.querySelectorAll( 'main h2, main h3, main h4' )).forEach( function( el ){

		if( el.getAttribute( 'id' ) === null ){

			el.setAttribute( 'id', el.innerText.trim().replace( /\s+/g, '_' ))
		}
		
		const 
		container = document.createElement( 'span' ),
		link = document.createElement( 'a' )
		
		container.classList.add( 'section-anchor' )
		container.appendChild( link )
		link.setAttribute( 'href', '#'+ el.getAttribute( 'id' ))
		link.innerText = '#'
		el.insertAdjacentElement( 'afterbegin', container )
	})


	Array.from( document.querySelectorAll( 'dt[id]' )).forEach( function( el ){
		
		const 
		container = document.createElement( 'div' ),
		link = document.createElement( 'a' )
		
		container.classList.add( 'section-anchor' )
		container.appendChild( link )
		link.setAttribute( 'href', '#'+ el.getAttribute( 'id' ))
		link.innerText = '&nbsp;'
		el.parentNode.appendChild( container )
	})


	onHashChange()
})



