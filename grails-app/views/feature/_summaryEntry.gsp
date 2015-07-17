<div class="col-md-offset-0 col-md-4">
    <ul class="list-group">
        <li class="list-group-item list-group-item-info">
            ${organism ? organism.commonName : "ALL"}
        </li>
        <li class="list-group-item">
            Genes <span class="badge">${summaryData.geneCount}</span>
        </li>
        <li class="list-group-item">
            Transcripts <span class="badge">${summaryData.transcriptCount}</span>
            <g:if test="${summaryData.transcriptTypeCount}">
                <ul class="list-group">
                    <g:each in="${summaryData.transcriptTypeCount}" var="transcriptType">
                        <li class="list-group-item">
                            ${transcriptType.key}
                            <span class="badge">
                            ${transcriptType.value}
                            </span>
                        </li>
                    </g:each>
                </ul>
            </g:if>
        </li>
        <li class="list-group-item">
            % Coding Transcripts (Features) <span class="badge">${(summaryData.proteinCodingTranscriptPercent* 100).round(2)} (${(summaryData.proteinCodingFeaturePercent * 100).round(2)})</span>
        </li>

        <li class="list-group-item">
            Transposable Elements <span class="badge">${summaryData.transposableElementCount}</span>
        </li>
        <li class="list-group-item">
            Repeat Regions <span class="badge">${summaryData.repeatRegionCount}</span>
        </li>
        <li class="list-group-item">
            Exons (Exons/Transcript)<span class="badge">${summaryData.exonCount} ${summaryData.exonCount ? "(${summaryData.exonsPerTranscript})" : ''} </span>
        </li>
    </ul>
</div>