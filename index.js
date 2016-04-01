var whois = require( 'whois' );
var q     = require( 'q' );

module.exports = {
    run: function(step, dexter) {
        var domains = step.input( 'domain' ).toArray();

        var lookups = [ ];
        domains.forEach( function( domain ) {
            var deferred = q.defer();
            whois.lookup( domain, function( err, result ) {
                if ( err ) { deferred.reject( err ) }
                else { deferred.resolve( result ) }
            } );

            lookups.push( deferred );
        } );

        var self = this;
        var ret  = [ ];

        q.all( lookups )
            .then( function( res ) {
                res.forEach( function( record ) { ret.push( { record: record } ) } );
                return self.complete( ret );
            } )
            .fail( function( err ) {
                return self.fail( err );
            } );
    }

};
