package org.bbop.apollo

class Genome {

    static constraints = {
        directory nullable: true
    }

    static hasMany = [
            tracks: Sequence
    ]

    String name
    String directory
}
