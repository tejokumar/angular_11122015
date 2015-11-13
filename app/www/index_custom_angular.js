<!DOCTYPE html>

<html>
	<head>
		<title>Welcome to Angular.js</title>
		<script src="libs/jquery/dist/jquery.js"></script>
		<script src="libs/angular/angular.js"></script>
	</head>

	<body>

		<div>
			<input type="text" data-two-way-bind="firstName" />
			<span data-one-way-bind="firstName"></span>
		</div>

		<div>
			<input type="text" data-two-way-bind="lastName" />
			<span data-one-way-bind="lastName"></span>
		</div>

		<script>
			var scope = {
				firstName: "Eric",
				lastName: "Greene",
				_watches: []
			};
			scope.addWatch = function (scopeProp, fn) {
				var theScope = this;
				var oldValue = undefined;
				theScope._watches.push(function () {
					if (oldValue !== theScope[scopeProp]) {
						fn(theScope[scopeProp], oldValue);
						oldValue = theScope[scopeProp];
						return true;
					}
					return false;
				});
			};
			$("[data-two-way-bind]").each(function (index, element) {
				var oldValue = undefined;
				scope._watches.push(function () {
					var fieldName = $(element).attr("data-two-way-bind");
					if (oldValue !== scope[fieldName]) {
						$(element).val(scope[fieldName]);
						oldValue = scope[fieldName];
						return true;
					}
					return false;
				});
				$(element).on("keyup", function (e) {
					var fieldName = $(e.target).attr("data-two-way-bind");
					scope[fieldName] = $(e.target).val();
					console.log(scope);
					digest();
				});
			});
			$("[data-one-way-bind]").each(function (index, element) {
				var oldValue = undefined;
				var fieldName = $(element).attr("data-one-way-bind");
				scope.addWatch(fieldName, function (newValue) {
					console.log("updating field: " + fieldName);
					$(element).text(newValue);
				});
			});
			scope.addWatch("firstName", function (newValue, oldValue) {
				console.log("firstName Old Value: " + oldValue);
				console.log("firstName New Value: " + newValue);
			});
			function digest(digestLoopCount) {
				var digestLoopMaxCount = 10, runDigestLoopAgain = false;
				digestLoopCount = digestLoopCount || 0;
				if (digestLoopCount >= digestLoopMaxCount) {
					throw Error("max digest loop count exceeded");
				}
				scope._watches.forEach(function (watchFn) {
					if (watchFn()) {
						runDigestLoopAgain = true;
					}
				});
				console.log("digest loop iteration: " + digestLoopCount);
				if (runDigestLoopAgain) {
					digest(++digestLoopCount);
				}
			}
			digest();
			console.log(scope);
		</script>

	</body>
</html>
