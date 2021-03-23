(function FirstExtension() {
    
    firstExtension = function() {};
    firstExtension.prototype = new Extension('FirstExtension');
    firstExtension.prototype.getMenu = () => {
        return {
            'Will do something, someday': function() {
            },
        };
    };
    firstExtension.prototype.getCategories = () => [
        new Extension.Category(
            'first-extension',
            new Color(10, 100, 10),
            [
                '-',
                '-',
                '-',
                'setCustomValue'
            ]
        )
    ];
    firstExtension.prototype.getBlocks = () => [
        new Extension.Block(
            'setCustomValue',
            'command',
            'first-extension',
            'set customValue to %n',
            [0],
            () => 'This is a test.'
        )
    ];

    NetsBloxExtensions.register(firstExtension);
})();