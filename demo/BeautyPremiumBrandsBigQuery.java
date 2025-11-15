package com.mercadolibre.verticals_landing_automation.repository;


import static com.mercadolibre.verticals_commons_lib.util.Profiles.PRODUCTION;
import static com.mercadolibre.verticals_commons_lib.util.Profiles.TEST;

import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.FieldValue;
import com.google.cloud.bigquery.FieldValueList;
import com.mercadolibre.verticals_commons_lib.clients.rest.BaseBigQueryExecutor;
import com.mercadolibre.verticals_commons_lib.config.BigQueryConfig;
import com.mercadolibre.verticals_landing_automation.dtos.bigquery.BeautyPremiumBrandsDto;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

/**
 * Implementation to query Beauty Premium Brands from BigQuery.
 */
@Repository
@Profile({PRODUCTION, TEST})
@Qualifier("beautyPremiumBrandsBigQueryRepository")
public class BeautyPremiumBrandsBigQuery extends BaseBigQueryExecutor<BeautyPremiumBrandsDto> {

    private static final String FIELD_SITE = "SITE_ID";
    private static final String FIELD_BRAND = "BRAND";
    private static final String FIELD_BRAND_ID = "BRAND_ID";
    private static final String FIELD_IS_BEAUTY_PREMIUM = "IS_BEAUTY_PREMIUM";
    private static final String FIELD_GMV_USD = "GMV_USD";


    public BeautyPremiumBrandsBigQuery(@Qualifier(BigQueryConfig.GENERAL_BIG_QUERY_CLIENT) final BigQuery bigQuery) {
        super(bigQuery);
    }

    @Override
    protected BeautyPremiumBrandsDto mapRow(FieldValueList row) {
        return BeautyPremiumBrandsDto.builder()
                .site(getStringValueSafely(row, FIELD_SITE))
                .brand(getStringValueSafely(row, FIELD_BRAND))
                .brandId(getStringValueSafely(row, FIELD_BRAND_ID))
                .isBeautyPremium(Boolean.TRUE.equals(getBooleanValueSafely(row)))
                .gmvUsd(getNumericValueSafely(row))
                .build();
    }

    private String getStringValueSafely(FieldValueList row, String fieldName) {
        FieldValue field = row.get(fieldName);
        return field.isNull() ? null : field.getStringValue();
    }

    private Boolean getBooleanValueSafely(FieldValueList row) {
        FieldValue field = row.get(BeautyPremiumBrandsBigQuery.FIELD_IS_BEAUTY_PREMIUM);
        return field.isNull() ? null : field.getBooleanValue();
    }

    private BigDecimal getNumericValueSafely(FieldValueList row) {
        FieldValue field = row.get(BeautyPremiumBrandsBigQuery.FIELD_GMV_USD);
        return field.isNull() ? null : field.getNumericValue();
    }
}
