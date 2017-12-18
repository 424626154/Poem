
module.exports = {
	randomFrom:function(lowerValue,upperValue)
	{
	 return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
	}
}
