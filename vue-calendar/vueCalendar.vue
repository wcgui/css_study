<template>
<div id='calendar' @click="eventDetails($event)">
		
</div>
</template>
<script>
import { SimpleCalendar } from "./js/simple-calendar";
import "./js/hammer-2.0.8-min";


export default {
	name: 'vueCalendar',
	props: {
		events: {
			type: Object,
			default: {

			}
		}
	},
    data() {
        return {
			myCalendar: ""
        }
    },
    created() {

	},
	watch: {
		events(curValue,oldValue) {
			this.myCalendar._options.mark = curValue;
			this.myCalendar.update();
		}
	},
    methods: {
		//点击查看时间详情
		eventDetails(event) {
			let target = event.target;
			
			if(target.classList.contains("announceContent") && target.getAttribute("data-type") == "eventDetails") {
				this.$emit("eventclick",target.getAttribute("data-event"));
			}
		}
    },
    mounted() {
		this.myCalendar = new SimpleCalendar('#calendar',{mark: this.events,});
    }
}
</script>
<style>
.sc-calendar {
	width: 100%;
	text-align: center;
	font-family: "Microsoft Yahei";
	color: #4A4A4A;
	background-color: white;
	font-size: 16px;
	/*height: 370px;*/
}
.sc-calendar:after {
	content: "";
	display: block;
	overflow: hidden;
	width: 0px;
	height: 0px;
	clear: both;
}
.sc-body.showmonth5{
	overflow: hidden;
}
.sc-body.showmonth6{
	overflow: hidden;
	/*height: 600px;*/
}

.sc-header {
	background: #1B82E6;
	width: 100%;
	height: 80px;
}

.sc-title {
	border-bottom: 0;
	color: white;
	padding: 20px 25px;
	overflow: hidden;
}
.year {
	float: left;
	position: relative;
	font-size: 15px;
}

.month {
	float: right;
	position: relative;
	box-sizing: border-box;
	font-size: 15px;
}

.monthdiv,
.yeardiv {
	position: relative;
	top: -5px;
	display: inline-block;
	min-width: 50px;
}

.yeardiv {
	min-width: 70px;	
}

.month .arrow,
.year .arrow {
	display: inline-block;
	width: 25px;
	height: 25px;
	cursor: pointer;
}

.sc-mleft,
.sc-yleft {
	background: url(./images/arrowLeftCircle.png) center top no-repeat;
	background-size: 100% 100%;
}

.sc-mright,
.sc-yright {
	background: url(./images/arrowRightCircle.png) center top no-repeat;
	background-size: 100% 100%;
}

.sc-header select {
	background: rgba(10,63,118, 0.2);
	padding: 5px;
	box-sizing: border-box;
	border-radius: 2px;
	border: 0px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-family: "Microsoft Yahei";
    color: #fff;
	font-size: 13px;
	outline: 0px;
	margin: 0 5px;
}


.sc-body {
	height: 79%;
	clear: both;
}

/*星期*/
.sc-week {
	height: 35px;
	font-weight: 400;
	font-size: 10px;
	line-height: 35px;
	color: #4A4A4A;
}

.sc-week-item {
	height: 100%;
	float: left;
	width: 14.285%;
	color: white;
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	background: #4e9fee;
	border-width: 1px 0 1px 1px;
	border-color: rgba(27,130,230,.5);
	border-style: solid;
}

.sc-week-item:nth-child(7n), .sc-week-item:nth-child(7n+6) {
    color: rgba(224, 8, 8, 0.74)!important;
}

/*日*/
.sc-days {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.sc-item {
	width: 14.285%;
	/*height: 20%;*/
	float: left;
	color: #565555;
	padding-bottom: 10px;
	font-weight: 600;
	background-color: #ffffff;
	box-sizing: border-box;
}

.sc-item .day {
	font-size: 16px;
	color: #333333;
	font-weight: normal;
	line-height: 20px;
}
.sc-item .lunar-day {
	font-size: 9px;
	color: #b2b2b2;
	font-weight: normal;
	overflow: hidden;
	text-overflow: ellipsis;
}

.sc-item:nth-child(7n) .day, .sc-item:nth-child(7n+6) .day {
    color: rgba(224, 8, 8, 0.74);
}

.sc-item-small {
	font-size: 0.416666rem !important;
}
.item-nolunar {
	padding-top: 0.833333rem;
}

.sc-vocation {
	background-color: #FFEBEC;
}

.sc-mark {
	background-color: #E5FBFA;
}
.mark{
	height: 15px;
	font-size: 14px;
	color: rgba(241, 43, 43, 1);
	margin: 0px;
}
.sc-mark-show {
	visibility: visible;
}

.sc-mark-hide {
	visibility: hidden;
}

.sc-vocation:before {
	content: '休';
	display: block;
	position: absolute;
	font-size: 0.7em;
	width: 1.2em;
	font-weight: 100;
	color: white;
	background-color: #E00808;
	margin-top: -0.416666rem;
}
.sc-premonth , .sc-nextmonth {
	color: #C1C0C0 !important;
}

.sc-premonth .day , .sc-nextmonth .day,
.sc-premonth .day, .sc-nextmonth .lunar-day {
	color: #C1C0C0 !important;
}

.sc-active-day,
.sc-selected {
	background: rgba(10,63,118,.2);
}
.sc-today {
	color: white;
	background: #0A3F76;
}

.sc-today .day {
	color: white !important;
}
.sc-today .lunar-day{
	color: white;
}
.sc-festival .lunar-day {
	color: #E00808;
}

.sc-announcement{
	text-align: left;
	margin-top: 0.15rem;
	background-color: white;
	width: 100%;
	/* padding: 0 0.5rem 0.3rem 0.3rem; */
}

.sc-matter {
	list-style: none;
	padding: 0px 10px;
}
.announceItem{
	width: 98%;
	border-bottom: 1px solid rgb(239,239,244);
	margin: 5px auto;
}

.announceImg {
	width: 7px;
	height: 15px;
	float: left;
    background: url(./images/content.png);
    background-size: 100%;
}

.announceContent{
	text-indent: 10px;
	font-size: 14px;
	line-height: 20px;
	color: #333333;
	margin: 0px;
}
.announceTime{
	font-size: 10px;
	line-height: 18px;
	color: #b2b2b2;
	margin-left: 0.2rem;
}

</style>